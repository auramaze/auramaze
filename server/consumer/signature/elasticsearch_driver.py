from image_match.signature_database_base import SignatureDatabaseBase
from image_match.signature_database_base import normalized_distance
from image_match.signature_database_base import make_record
from datetime import datetime
import numpy as np
from collections import deque


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

    def search_single_record(self, rec, pre_filter=None):
        path = rec.pop('path')
        signature = rec.pop('signature')
        if 'metadata' in rec:
            rec.pop('metadata')

        # build the 'should' list
        should = [{'term': {word: rec[word]}} for word in rec]
        body = {
            'query': {
                'bool': {'should': should}
            },
            '_source': {'excludes': ['simple_word_*']}
        }

        if pre_filter is not None:
            body['query']['bool']['filter'] = pre_filter

        res = self.es.search(index=self.index,
                             doc_type=self.doc_type,
                             body=body,
                             size=self.size,
                             timeout=self.timeout)['hits']['hits']

        sigs = np.array([x['_source']['signature'] for x in res])

        if sigs.size == 0:
            return []

        dists = normalized_distance(sigs, np.array(signature))

        formatted_res = [{'id': x['_id'],
                          'score': x['_score'],
                          'metadata': x['_source'].get('metadata'),
                          'path': x['_source'].get('url', x['_source'].get('path'))}
                         for x in res]

        for i, row in enumerate(formatted_res):
            row['dist'] = dists[i]
        formatted_res = filter(lambda y: y['dist'] < self.distance_cutoff, formatted_res)

        return formatted_res

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
                rec = dict(filter(lambda item: item[0] == 'signature' or item[0].startswith('simple_word_'), rec.items()))
                image_dict[key] = {**image_dict[key], **rec}
        self.es.update(index=self.index, doc_type=self.doc_type, id=id,
                       body={'doc': {'image': image_dict}, 'doc_as_upsert': True},
                       refresh=refresh_after)

    def insert_single_record(self, rec, refresh_after=False):
        rec['timestamp'] = datetime.now()
        self.es.index(index=self.index, doc_type=self.doc_type, body=rec, refresh=refresh_after)

    def delete_duplicates(self, path):
        """Delete all but one entries in elasticsearch whose `path` value is equivalent to that of path.
        Args:
            path (string): path value to compare to those in the elastic search
        """
        matching_paths = [item['_id'] for item in
                          self.es.search(body={'query':
                                                   {'match':
                                                        {'path': path}
                                                    }
                                               },
                                         index=self.index)['hits']['hits']
                          if item['_source']['path'] == path]
        if len(matching_paths) > 0:
            for id_tag in matching_paths[1:]:
                self.es.delete(index=self.index, doc_type=self.doc_type, id=id_tag)
