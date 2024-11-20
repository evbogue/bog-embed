import { joinRoom } from 'https://esm.sh/gh/evbogue/bogbookv4@6d2990fde7/lib/trystero-torrent.min.js'
import { h } from 'https://esm.sh/gh/evbogue/bogbookv4@6d2990fde7/lib/h.js'
import { bogbot } from 'https://esm.sh/gh/evbogue/bogbookv4@6d2990fde7/bogbot.js'
import { markdown } from 'https://esm.sh/gh/evbogue/bogbookv4@908853d675/markdown.js'
import { parseYaml } from 'https://esm.sh/gh/evbogue/wiredove@11d1eea293/yaml.js'
import { human } from 'https://esm.sh/gh/evbogue/wiredove@11d1eea293/lib/human.js'

export const embed = (hash, div) => {

  if (hash.length === 44) {
    const room = joinRoom({appId: 'bogsite', password: 'password'}, hash)

    const [ sendHash, onHash ] = room.makeAction('hash')
    const [ sendBlob, onBlob ] = room.makeAction('blob')

    room.onPeerJoin(peer => {
      sendHash(hash, peer)
    })

    onBlob(async (blob, id) => {
      console.log(blob)
      try {
        const opened = await bogbot.open(blob)
        console.log(opened)
        if (opened.author === hash && !div.childNodes[0]) {
          const extr = await parseYaml(opened.text)
          sendHash(extr.image) 
          const img = h('img', {id: extr.image, style: "width: 150px; height: 150px; object-fit: cover; float: left; margin-right: .5em;"})
          const d = h('div', [
            h('a', {style: 'float: right;', href: 'https://wiredove.net/#' + opened.hash}, [human(new Date(opened.timestamp))]),
            h('a', {href: 'https://wiredove.net/#' + opened.author}, [
              img,
              ' ',
              extr.name,
            ]),
            h('span', {innerHTML: await markdown(extr.body)})    
          ])
          div.appendChild(d)
          div.appendChild(h('div', [JSON.stringify(extr)]))
        }
      } catch (err) { console.log(err)}
    try {
      const blobhash = await bogbot.make(blob)
      const got = document.getElementById(blobhash)
      got.src = blob
    } catch (err) {}
    })
  }
}
