import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import sha1 from 'sha1'
import superagent from 'superagent'

class Images extends Component {

    constructor() {
        super()
        this.state = {
            images: []
        }

    }

    uploadFile(files) {
        console.log('uploadFiles: ')
        const image = files[0]

        // Add your cloudName
        const cloudName = '<cloudName>'
        const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload'

        // Add your uploadPreset
        const timestamp = Date.now()/1000
        const uploadPreset = '<uploadPreset>'

        // Add your API Secret
        const paramsStr = 'timestamp='+timestamp+'&upload_preset='+
            uploadPreset+'<API Secret>'

        // Add your api key
        const signature = sha1(paramsStr)
        const params = {
            'api_key': '<api_key>',
            'timestamp': timestamp,
            'upload_preset': uploadPreset,
            'signature': signature
        }

    let uploadRequest = superagent.post(url)
    uploadRequest.attach('file', image)

    Object.keys(params).forEach((key) => {
        uploadRequest.field(key, params[key])
    })

    uploadRequest.end((err, resp) => {
        if (err) {
            alert(err, null)
            return
        }

        console.log('UPLOAD COMPLETE: '+JSON.stringify(resp.body))
        const uploaded = resp.body

        let updatedImages = Object.assign([], this.state.images)
        updatedImages.push(uploaded)

        this.setState({
            images: updatedImages
        })
    })
}

    removeImage(event) {
        event.preventDefault()
        console.log('removeImages: '+event.target.id)

        let updatedImages = Object.assign([], this.state.images)
        updatedImages.splice(event.target.id,1)

        this.setState({
            images: updatedImages
        })
    }

    render() {
        const list = this.state.images.map((image, i) => {
            return (
                <li key={i}>
                    <img style={{width:72}} src={image.secure_url} />
                    <br /> <a id={i} onClick={this.removeImage.bind(this)} href="#">remove</a>
                </li>
            )
        })

        return (
            <div>
                Images Component
                <Dropzone onDrop={this.uploadFile.bind(this)}/>
                <ol>
                    { list }
                </ol>
            </div>
        )
    }
}

export default Images
