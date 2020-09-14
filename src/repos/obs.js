const ObsClient = require('esdk-obs-nodejs')
const config = require('../../config')

let instance = null

class ObsRepo {
  constructor() {
    this.obsClient = new ObsClient({
      access_key_id: config.obs.accessKeyId,
      secret_access_key: config.obs.secretAccessKey,
      server: config.obs.server
    })

    console.log('on obsRepo.constructor:', typeof this.obsClient);
  }

  async putObject({ Bucket, Key, Body, ContentType, ContentLength }) {
    console.log('on obsrepo.putObject:', { Bucket, Key, Body, ContentType, ContentLength });

    return this.obsClient.putObject({ Bucket, Key, Body, ContentType, ContentLength })
      .then(result => {
        console.log('on obsRepo.putObject.result:', result);
        if (result.CommonMsg.Status < 300) {
          console.log('on obsRepo.putObject.<300');
          return {
            etag: result.InterfaceResult.ETag,
            // versionId: result.InterfaceResult.VersionId,
            message: result.CommonMsg.Message
          }
        }

        throw new Error(result.CommonMsg.Message)
      })
      .catch(err => {
        console.log(`Erorr: ${__dirname}: ${err.message}`);
        throw err
      })
  }

  async getObject({ Bucket, Key }) {
    return this.obsClient.getObject({ Bucket, Key, SaveAsStream: true })
      .then(result => {
        if (result.CommonMsg.Status < 300) {
          console.log('on getObj.stream:', {
            ContentLength: result.InterfaceResult.ContentLength,
            Date: result.InterfaceResult.Date,
            Reserved: result.InterfaceResult.Reserved,
            RequestId: result.InterfaceResult.RequestId,
            Id2: result.InterfaceResult.Id2,
            ETag: result.InterfaceResult.ETag,
            ContentType: result.InterfaceResult.ContentType,
            LastModified: result.InterfaceResult.LastModified,
            Metadata: result.InterfaceResult.Metadata,
            MetadataObs: result.InterfaceResult.MetadataObs,
            MetadataV2: result.InterfaceResult.MetadataV2,
            // Content: result.InterfaceResult.Content
          })
          return {
            etag: result.InterfaceResult.ETag,
            contentLength: result.InterfaceResult.ContentLength,
            contentType: result.InterfaceResult.ContentType,
            content: result.InterfaceResult.Content,
          }
        }

        throw new Error(result.CommonMsg.Message)
      })
      .catch(err => {
        console.log(`Erorr: ${__dirname}: ${err.message}`);
        throw err
      })
  }
}

// SingeltonClass for allow to instantiate an object once
class SingeltonObs {
  static getInstance() {
    if (!instance) {
      instance = new ObsRepo()
    }

    console.log('on repo.obs.SingeltonObs.instance:', typeof instance);

    return instance
  }
}

module.exports = SingeltonObs

