from bs4 import BeautifulSoup

def get_ical_url(xml_string):
    soup = BeautifulSoup(xml_string, "xml")
    tag = soup.find("ICalUrl")
    return tag.string

if __name__ == "__main__":
    with open("sharing_metadata.xml", 'r') as fp:
        print(get_ical_url(fp.read()))
