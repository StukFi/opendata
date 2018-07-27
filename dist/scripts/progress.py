import sys

def display_progress(message, count, total):
    """
    Updates a single line displaying the progress of a task.

    :param message: message describing the task
    :param count: number of completed subtasks
    :param total: total number of subtasks
    """
    sys.stdout.write("\r" + message + ": {0} / {1}".format(count, total))
    sys.stdout.flush()

    if count == total:
        sys.stdout.write("\n")