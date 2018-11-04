"""Hexagon Coordinate System."""

from setuptools import setup

setup(
    name='artwork-crawler',
    version='0.1',
    description='Web Crawler for Artworks of EECS 441',
    url='http://github.com/youdymoo/artwork-crawler',
    author='Ray Cao',
    author_email='youdymoo@umich.edu',
    include_package_data=True,
    install_requires=[
        'google-api-python-client',
        'Pillow',
        'numpy',
        'scipy',
        'fastdtw',
        'unidecode'
    ],
    license='MIT',
    packages=['artwork-crawler'],
    zip_safe=False
)
