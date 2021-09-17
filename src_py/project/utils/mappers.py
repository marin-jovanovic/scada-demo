"""
translation mappers

"""

ELEMENTS = []


def init_elements():
    global ELEMENTS

    raw_input = [
        line[:-1] for line in open("temp/elements.txt").readlines()
        if not (line.startswith("//") or line.startswith("\n"))
    ]

    for raw_elem in raw_input:
        loader = raw_elem.split(" ")

        name = loader[0]

        if len(loader) == 1:
            ELEMENTS.append(name)

        else:
            temp = loader[1][1:-1].split("-")
            range_lower_bound = int(temp[0])
            range_upper_bound = int(temp[1])

            for i in range(range_lower_bound, range_upper_bound):
                ELEMENTS.append(name + "_" + str(i))

    for elem in ELEMENTS:
        print(elem)


if __name__ == '__main__':
    init_elements()
