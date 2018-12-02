import grequests
from collections import Counter
import json

WORKER = 50


def exception_handler(request, exception):
    print(request, str(exception))

def main():
    datalist = []
    tasks_list = [11]
    for task in tasks_list:
        with open('./art_posts/arts-{}.json'.format(task), 'r') as original_json_file:
            datalist = json.load(original_json_file)
        jobs = (grequests.put("https://apidev.auramaze.org/v1/art/{}".format(data['username']), json=data) for data in datalist)
        results = grequests.imap(jobs, exception_handler=exception_handler, size=WORKER)
        status_codes = []
        for result in results:
            status_codes.append(result.status_code)
        print(Counter(status_codes))
        # with open('./log/arts-{}.log'.format(task), 'w+') as write_log_file:
        #     write_log_file.write(str(results))

if __name__ == '__main__':
    main()
