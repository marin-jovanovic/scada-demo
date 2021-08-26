"""
other utils

"""

import io

from hat.gui.vt import parse


def print_vt(source=None):
    if source is None:
        source = "temp/source.txt"

    with open(source) as input_lines:
        input_lines = input_lines.read().replace("\n", "")

        print(f"{input_lines=}")

        # for line in input_lines:
        xml = input_lines

        stripped = ''.join(line.lstrip() for line in xml.split('\n'))
        stream = io.StringIO(stripped)
        parsed = parse(stream)
        print(f"{parsed=}")
        print(parsed)


def main():
    print_vt("temp/new_source.txt")


if __name__ == '__main__':
    main()

# os path join for paths
