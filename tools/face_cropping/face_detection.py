import numpy as np
import cv2
import shutil
import os
import argparse
import glob
from tqdm import tqdm


class FaceDetect:

    def __init__(self, padding=1.):
        self.face_cascade = cv2.CascadeClassifier('haarcascades/haarcascade_frontalface_alt2.xml')
        self.PADDING = padding

    def process(self, input_path, output_path):
        img = FaceDetect._load_image(input_path)
        head = self._detect(img)
        if head is None:
            return False
        clipped = FaceDetect._clip(img, head)
        FaceDetect._save(clipped, output_path)
        return True

    def _detect(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        W, H = gray.shape
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) == 0:
            return None
        (x, y, w, h) = faces[0]
        center = (x + w/2, y + h/2)
        r = (1 + self.PADDING) * (w + h) / 4
        r = int(min([r, center[0], center[1], W - center[1], H - center[0]])) - 1
        anchor = (int(center[0] - r), int(center[1] - r))
        head = np.array([anchor[0], anchor[1], 2*r, 2*r])

        # cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
        # cv2.rectangle(img, (anchor[0], anchor[1]), (anchor[0] + 2*r, anchor[1] + 2*r), (255, 0, 0), 2)
        # cv2.imshow('img', img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        return head

    @staticmethod
    def _clip(img, head):
        cropped = img[head[1]:head[1] + head[3], head[0]:head[0] + head[2]]
        interpolation = cv2.INTER_AREA
        if cropped.shape[0] < 128:
            interpolation = cv2.INTER_CUBIC
        resized = cv2.resize(cropped, (128, 128), interpolation=interpolation)
        return resized

    @staticmethod
    def _save(img, output_path):
        cv2.imwrite(output_path, img)

    @staticmethod
    def _load_image(input_path):
        return cv2.imread(input_path)


def main():
    parser = argparse.ArgumentParser(description='artist profile photo processor')
    parser.add_argument('-in', '--input_path', action='store', required=True, type=str, help='specify input path')
    parser.add_argument('-out', '--output_path', action='store', required=True, type=str, help='specify output path')
    args = parser.parse_args()

    driver = FaceDetect(padding=0.6)
    invalid_list = []
    for file in tqdm(glob.glob(os.path.join(args.input_path, '*'))):
        input_path = os.path.join(args.input_path, os.path.basename(file))
        output_path = os.path.join(args.output_path, os.path.basename(file))
        try:
            if not driver.process(input_path, output_path):
                invalid_list.append(os.path.basename(file))
                shutil.copy(input_path, args.output_path + '_invalid')
        except:
            invalid_list.append(os.path.basename(file))
            shutil.copy(input_path, args.output_path + 'invalid')
    with open('invalid.log', 'w') as f:
        f.write('\n'.join(invalid_list) + '\n')


if __name__ == '__main__':
    main()
