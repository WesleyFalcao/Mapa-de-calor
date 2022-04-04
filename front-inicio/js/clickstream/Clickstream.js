
const trackClickstream = () => {
      const data = []

      const pushEventData = ({ pageX, pageY, type }) => {
            data.push({
                  time: Date.now(),
                  x: pageX,
                  y: pageY,
                  type
            })

            // console.log(data);
      }

      document.addEventListener("mousemove", pushEventData)
      document.addEventListener("click", pushEventData)

      return data
}

const paintLive = (data, max = 5) => {
      const heatmap = h337.create({
            container: document.documentElement,
      })

      heatmap.setData({
            max,
            data,
      }) 
}

setInterval(() => {
      paintLive(data);
}, 10);

const postData = (url, data) => {
      const name = Date.now();
      fetch(`${url}/?name=${name}`,{
            method: "POST",
            headers:{
                  "Content-Type": "aplication/json"
            },
            body: JSON.stringify(data)
      })
}

const data = trackClickstream()
window.onbeforeunload = () => postData("http://localhost:3001/api/", data)

// export default paintLive(data)

