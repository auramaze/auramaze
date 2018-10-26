import numpy as np
import cv2
import os
import glob
from tqdm import tqdm


class FaceDetect:

    def __init__(self, padding=1):
        self.face_cascade = cv2.CascadeClassifier('haarcascades\\haarcascade_frontalface_alt2.xml')
        self.PADDING = padding

    def process(self, input_path, output_path):
        img = FaceDetect._load_image(input_path)
        head = self._detect(img)

        clipped = FaceDetect._clip(img, head)
        FaceDetect._save(clipped, output_path)

    def _detect(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        W, H = gray.shape
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) == 0:
            return (0, 0, H, W)
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
        return img[head[1]:head[1] + head[3], head[0]:head[0] + head[2]]

    @staticmethod
    def _save(img, output_path):
        cv2.imwrite(output_path, img)

    @staticmethod
    def _load_image(input_path):
        return cv2.imread(input_path)


def main():
    driver = FaceDetect(padding=0.6)
    for file in tqdm(glob.glob('artists\\*')):
        input_path = 'artists\\' + os.path.basename(file)
        output_path = 'profiles\\' + os.path.basename(file)
        driver.process(input_path, output_path)


if __name__ == '__main__':
    main()