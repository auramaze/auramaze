import cv2
import numpy as np
from PIL import Image
import io


class Photo:
    def __init__(self, raw, N=10, canny1=5, canny2=50, canny3=1, approx=0.02):
        self.raw = raw
        self.N = N
        self.canny1 = canny1
        self.canny2 = canny2
        self.canny3 = canny3
        self.approx = approx
        self.image = Image.open(io.BytesIO(raw))
        self.array = np.asanyarray(self.image)
        self.boxes = self.generate_boxes()

    def get_raw(self):
        return self.raw

    def get_image(self):
        return self.image

    def get_array(self):
        return self.array

    def generate_boxes(self):
        record = set()
        oldshape = self.array.shape
        image = cv2.resize(self.array, (600, 800))
        newshape = image.shape

        gray0 = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        timg = cv2.medianBlur(image, 9)

        for c in range(3):
            ch = [c, 0]
            cv2.mixChannels([timg], [gray0], ch)

            for l in range(self.N):
                if l == 0:
                    gray = cv2.Canny(gray0, self.canny1, self.canny2, self.canny3 * 2 + 1)
                    gray = cv2.dilate(gray, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)))
                else:
                    _, gray = cv2.threshold(gray0, (l + 1) * 255 / self.N, 255, cv2.THRESH_BINARY)
                    # gray=cv2.convertScaleAbs(gray)
                    # cv2.Mat()
                _, contour, _ = cv2.findContours(gray, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)

                for i in range(len(contour)):
                    approx = cv2.approxPolyDP(contour[i], cv2.arcLength(contour[i], True) * self.approx, True)
                    if len(approx) == 4 and abs(cv2.contourArea(approx)) > 1000 and cv2.isContourConvex(approx):
                        maxCosine = 0.0
                        for j in range(2, 5):
                            cosine = abs(self.angle(approx[j % 4], approx[j - 2], approx[j - 1]))
                            maxCosine = max(maxCosine, cosine)
                        if maxCosine < 0.3:
                            for it in approx:
                                it[0][0] *= oldshape[1] / newshape[1]
                                it[0][1] *= oldshape[0] / newshape[0]
                            box = tuple((it[0][0], it[0][1]) for it in approx)
                            sorted_box = tuple(sorted(box))
                            if sorted_box not in record:
                                record.add(sorted_box)
                                yield box

    def generate_paintings(self):
        for box in self.boxes:
            width = max(coord[0] for coord in box) - min(coord[0] for coord in box)
            height = max(coord[1] for coord in box) - min(coord[1] for coord in box)

            min_sum_index, min_sum_item = min(enumerate(box), key=lambda item: sum(item[1]))
            max_sum_index = (min_sum_index + 2) % 4
            target = [()] * 4
            target[min_sum_index] = (0, 0)
            target[max_sum_index] = (width, height)

            i1 = (min_sum_index + 1) % 4
            i2 = (min_sum_index + 3) % 4

            if box[i1][0] - box[i2][0] > box[i1][1] - box[i2][1]:
                target[i1], target[i2] = (width, 0), (0, height)
            else:
                target[i1], target[i2] = (0, height), (width, 0)

            coeffs = self.find_coeffs(target, box)

            img_transform = self.image.transform((width, height), Image.PERSPECTIVE, coeffs,
                                                 Image.BICUBIC)

            output = io.BytesIO()
            img_transform.convert('RGB').save(output, 'JPEG')
            yield output.getvalue()

    @staticmethod
    def angle(pt1, pt2, pt0):
        dx1 = float(pt1[0][0] - pt0[0][0])
        dy1 = float(pt1[0][1] - pt0[0][1])
        dx2 = float(pt2[0][0] - pt0[0][0])
        dy2 = float(pt2[0][1] - pt0[0][1])

        return (dx1 * dx2 + dy1 * dy2) / np.sqrt((dx1 * dx1 + dy1 * dy1) * (dx2 * dx2 + dy2 * dy2) + 1e-10)

    @staticmethod
    def find_coeffs(pa, pb):
        matrix = []
        for p1, p2 in zip(pa, pb):
            matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0] * p1[0], -p2[0] * p1[1]])
            matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1] * p1[0], -p2[1] * p1[1]])

        A = np.matrix(matrix, dtype=np.float)
        B = np.array(pb).reshape(8)

        res = np.dot(np.linalg.inv(A.T * A) * A.T, B)
        return np.array(res).reshape(8)
