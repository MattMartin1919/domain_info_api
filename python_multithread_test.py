import asyncio
import aiohttp
import time

start = time.time()

loop = asyncio.get_event_loop()
final_data = []
number_counter = 1

class SilentServer(asyncio.Protocol):
    def connection_made(self, transport):
        # We will know when the connection is actually made:
        print('SERVER |', transport.get_extra_info('peername'))

def cleanUrl(url):
  return url.split("/")[0].split("?")[0].split("#")[0].replace("http://","").replace("https://","").replace("www.","")

async def get_data(url, session):
    global number_counter
    actualUrl = url.split('?url=')[1]
    print (url)
    try:
        async with session.get(url=url) as r:
            final_data.append({
                'content': await r.text(),
                'url': actualUrl
            })
    except:
        print(f'something went wrong getting {url}')
        final_data.append({
            'content': "error getting info",
            'url': actualUrl
        })
    finally:
        print(f'done with {number_counter}')
        number_counter = number_counter + 1

f = open("URL analysis.csv", "r")


# make array of cleaned urls
finalUrls = []
for line in f:
    if 'website,Clean URL,Website Data' in line:
        continue
    finalUrls.append("http://127.0.0.1:3000/domain_data?url=" + cleanUrl(line.split(',')[1]))

conn = aiohttp.TCPConnector(limit=50) # number of connections at one time
timeout = aiohttp.ClientTimeout(total=(60 * 60 * 6)) # timeout set for the whole program.  6 hours by default which should cover ~30k sites
session = aiohttp.ClientSession(connector=conn, loop=loop, timeout=timeout)

async def test():
    await loop.create_server(SilentServer, '127.0.0.1', 1337)
    await asyncio.gather(*(get_data(url, session=session) for url in finalUrls))

loop.run_until_complete(test())
end = time.time()
print(f'the program ran for {end - start}')
f = open("test.csv", "w+")
f.write(str(final_data))