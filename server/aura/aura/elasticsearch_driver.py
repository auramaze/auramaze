from image_match.signature_database_base import SignatureDatabaseBase
from image_match.signature_database_base import normalized_distance
from image_match.signature_database_base import make_record
from datetime import datetime
import numpy as np
from collections import deque
from itertools import product
from operator import itemgetter
from PIL import Image


class AuraMazeSignatureES(SignatureDatabaseBase):
    """Elasticsearch driver for image-match

    """

    def __init__(self, es, index='art', doc_type='_doc', timeout='10s', size=100,
                 *args, **kwargs):
        """Extra setup for Elasticsearch

        Args:
            es (elasticsearch): an instance of the elasticsearch python driver
            index (Optional[string]): a name for the Elasticsearch index (default 'art')
            doc_type (Optional[string]): a name for the document time (default '_doc')
            timeout (Optional[int]): how long to wait on an Elasticsearch query, in seconds (default 10)
            size (Optional[int]): maximum number of Elasticsearch results (default 100)
            *args (Optional): Variable length argument list to pass to base constructor
            **kwargs (Optional): Arbitrary keyword arguments to pass to base constructor

        Examples:
            >>> from elasticsearch import Elasticsearch
            >>> from elasticsearch_driver import AuraMazeSignatureES
            >>> es = Elasticsearch()
            >>> ses = AuraMazeSignatureES(es)
            >>> ses.add_image('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/687px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg')
            >>> ses.search_image('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/687px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg')
            [
             {'dist': 0.0,
              'id': u'AVM37nMg0osmmAxpPvx6',
              'path': u'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/687px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg',
              'score': 0.28797293}
            ]

        """
        self.es = es
        self.index = index
        self.doc_type = doc_type
        self.timeout = timeout
        self.size = size

        super(AuraMazeSignatureES, self).__init__(*args, **kwargs)

    def search_image(self, path, all_orientations=False, bytestream=False):
        """Search for matches

        Args:
            path (string): path or image data. If bytestream=False, then path is assumed to be
                a URL or filesystem path. Otherwise, it's assumed to be raw image data
            all_orientations (Optional[boolean]): if True, search for all combinations of mirror
                images, rotations, and color inversions (default False)
            bytestream (Optional[boolean]): will the image be passed as raw bytes?
                That is, is the 'path_or_image' argument an in-memory image?
                (default False)

        Returns:
            a formatted list of dicts representing unique matches, sorted by dist

            For example, if three matches are found:

            [
             {'dist': 0.069116439263706961,
              'id': u'AVM37oZq0osmmAxpPvx7',
              'path': u'https://pixabay.com/static/uploads/photo/2012/11/28/08/56/mona-lisa-67506_960_720.jpg'},
             {'dist': 0.22484320805049718,
              'id': u'AVM37nMg0osmmAxpPvx6',
              'path': u'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg/687px-Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg'},
             {'dist': 0.42529792112113302,
              'id': u'AVM37p530osmmAxpPvx9',
              'path': u'https://c2.staticflickr.com/8/7158/6814444991_08d82de57e_z.jpg'}
            ]

        """
        img = self.gis.preprocess_image(path, bytestream)

        def crop_by_scale(img, k):
            y, x = img.shape
            return img[int(round((y * (1 - k) / 2))):int(round((y * (1 + k) // 2))),
                   int(round((x * (1 - k) // 2))):int(round((x * (1 + k) // 2)))]

        if all_orientations:
            # use four rotations
            rotations = [lambda x: x,
                         np.rot90,
                         lambda x: np.rot90(x, 2),
                         lambda x: np.rot90(x, 3)]

            # rotations = [lambda x: x]

            # crop image
            crops = [lambda x: x,
                     lambda x: crop_by_scale(x, 0.9),
                     lambda x: crop_by_scale(x, 0.8),
                     lambda x: crop_by_scale(x, 0.7)]

            # crops = [lambda x: x,
            #          lambda x: crop_by_scale(x, 0.9)]

            orientations = product(rotations, crops)

        else:
            # otherwise just use the identity transformation
            orientations = [lambda x: x]

        # try for every possible combination of transformations; if all_orientations=False,
        # this will only take one iteration
        transformed_records = []
        for transform in orientations:
            # compose all functions and apply on signature
            transformed_img = transform[0](transform[1](img))
            # print(transformed_img.shape)
            # im = Image.fromarray(np.stack((np.multiply(transformed_img, 255),) * 3, axis=-1).astype('uint8'))
            # im.show()

            # generate the signature
            transformed_record = make_record(transformed_img, self.gis, self.k, self.N)
            transformed_records.append(transformed_record)

        return self.search_multiple_records(transformed_records)

    def search_single_record(self, rec, pre_filter=None):
        path = rec.pop('path')
        signature = rec.pop('signature')
        if 'metadata' in rec:
            rec.pop('metadata')

        # build the 'should' list
        should = [{'term': {'image.default.' + word: rec[word]}} for word in rec]
        body = {
            'query': {
                'bool': {'should': should}
            },
            '_source': {'excludes': ['simple_word_*']}
        }

        if pre_filter is not None:
            body['query']['bool']['filter'] = pre_filter

        import time
        # print('send-{}'.format(time.time()))
        res = self.es.search(index=self.index,
                             doc_type=self.doc_type,
                             body=body,
                             size=self.size)['hits']['hits']
        # print('receive-{}'.format(time.time()))

        sigs = np.array([x['_source']['image']['default']['signature'] for x in res])

        if sigs.size == 0:
            return []

        dists = normalized_distance(sigs, np.array(signature))

        formatted_res = [{**x['_source'], '_score': x['_score']}
                         for x in res]

        for i, row in enumerate(formatted_res):
            row['dist'] = dists[i]
        formatted_res = filter(lambda y: y['dist'] < self.distance_cutoff, formatted_res)

        return formatted_res

    def search_multiple_records(self, rec_arr, pre_filter=None):
        request = []
        signatures = []
        for rec in rec_arr:
            path = rec.pop('path')
            signatures.append(rec.pop('signature'))
            if 'metadata' in rec:
                rec.pop('metadata')

            # build the 'should' list
            should = [{'term': {'image.default.' + word: rec[word]}} for word in rec]
            body = {
                'query': {
                    'bool': {'should': should}
                },
                '_source': {'excludes': ['simple_word_*']},
                'size': self.size
            }

            if pre_filter is not None:
                body['query']['bool']['filter'] = pre_filter

            head = {'index': self.index, 'type': self.doc_type}
            request.extend([head, body])

        responses = self.es.msearch(body=request)['responses']

        result = []

        for response, signature in zip(responses, signatures):
            res = response['hits']['hits']
            sigs = np.array([x['_source']['image']['default']['signature'] for x in res])

            if sigs.size == 0:
                continue

            dists = normalized_distance(sigs, np.array(signature))

            formatted_res = [{**x['_source'], '_score': x['_score']}
                             for x in res]

            for i, row in enumerate(formatted_res):
                row['dist'] = dists[i]
            formatted_res = filter(lambda y: y['dist'] < self.distance_cutoff, formatted_res)

            result.extend(formatted_res)

        ids = set()
        result = sorted(result, key=itemgetter('dist'))
        unique = []
        for item in result:
            if 'id' in item and item['id'] not in ids:
                unique.append(item)
                ids.add(item['id'])

        return unique

    def update_image(self, id, image_dict, refresh_after=False):
        """Update image property in Elasticsearch

        Args:
            id (int): id of Elasticsearch art document
            image_dict (dict): value of `image` column from Aurora `art` table
        """
        if image_dict:
            for key in image_dict:
                path = image_dict[key]['url']
                rec = make_record(path, self.gis, self.k, self.N, img=None, bytestream=False, metadata=None)
                rec = dict(
                    filter(lambda item: item[0] == 'signature' or item[0].startswith('simple_word_'), rec.items()))
                image_dict[key] = {**image_dict[key], **rec}
        self.es.update(index=self.index, doc_type=self.doc_type, id=id,
                       body={'doc': {'image': image_dict}, 'doc_as_upsert': True},
                       refresh=refresh_after)

    def insert_single_record(self, rec, refresh_after=False):
        rec['timestamp'] = datetime.now()
        self.es.index(index=self.index, doc_type=self.doc_type, body=rec, refresh=refresh_after)

    # def delete_duplicates(self, path):
    #     """Delete all but one entries in elasticsearch whose `path` value is equivalent to that of path.
    #     Args:
    #         path (string): path value to compare to those in the elastic search
    #     """
    #     matching_paths = [item['_id'] for item in
    #                       self.es.search(body={'query':
    #                                                {'match':
    #                                                     {'path': path}
    #                                                 }
    #                                            },
    #                                      index=self.index)['hits']['hits']
    #                       if item['_source']['path'] == path]
    #     if len(matching_paths) > 0:
    #         for id_tag in matching_paths[1:]:
    #             self.es.delete(index=self.index, doc_type=self.doc_type, id=id_tag)
