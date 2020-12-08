import asyncio
import aiohttp
import time
import json

# global Variables
start = time.time()
loop = asyncio.get_event_loop()
final_data = ""
number_counter = 1

# files to read and write
readFile = open("urls.csv", "r", encoding='utf-8')
writeFile = open("output.csv", "w+", encoding='utf-8')

# silent server class
class SilentServer(asyncio.Protocol):
    def connection_made(self, transport):
        # We will know when the connection is actually made:
        print('SERVER |', transport.get_extra_info('peername'))

# used to clean the URLS in the list
def cleanUrl(url):
  return url.replace("http://","").replace("https://","").replace("www.","").split("/")[0].split("?")[0].split("#")[0].replace("\n","")

# used to clean and output the ECP data
def getAndCleanEcpData(data):
    return str(json.loads(data)['data']['Ecommerce']).replace("'Cart Functionality'","").replace("'borderfree'","").replace("'Riskified'","")

# function to get the data from the calls
async def get_data(url, session):
    global number_counter
    global final_data
    actualUrl = url.split('?url=')[1]
    try:
        async with session.get(url=url) as r:
            content = await r.text()
            ecps = getAndCleanEcpData(content)
            final_data = final_data + (actualUrl + ',' + '"' + ecps + '"' + "\n")
    except:
        print(f'something went wrong getting {url}')
        final_data = final_data + (actualUrl + ',' + "none" + "\n")
    finally:
        print(f'done with {number_counter}')
        number_counter = number_counter + 1

# populate the array for calls to our API
finalUrls = []
for line in readFile:
    # ignore headers
    if 'website' in line:
        continue
    finalUrls.append("http://127.0.0.1:3000/domain_data?url=" + cleanUrl(line))

# make the connections
conn = aiohttp.TCPConnector(limit=30) # number of connections at one time
timeout = aiohttp.ClientTimeout(total=(60 * 60 * 6)) # timeout set for the whole program.  6 hours by default which should cover ~30k sites
session = aiohttp.ClientSession(connector=conn, loop=loop, timeout=timeout)

# start the tests
async def test():
    await loop.create_server(SilentServer, '127.0.0.1', 1337)
    await asyncio.gather(*(get_data(url, session=session) for url in finalUrls))

# start the program
loop.run_until_complete(test())

# output total time to complete the data pull
end = time.time()
print(f'the program ran for {end - start}')

# write data to file for easy vlookup in excel
writeFile.write(str(final_data))