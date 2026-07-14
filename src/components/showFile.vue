<template>
    <v-overlay v-model="overlayImg" class="style-bg align-center justify-center" :contained="absolute">
      <img :src="url" />
      <v-btn
          class="btn-overlay"
          icon
          @click="overlayImg = false"
      >
      <v-icon icon="fa-solid fa-xmark" color="white" />
      </v-btn>
    </v-overlay>
</template>

<script>
import axios from "axios";
export default {
    data:() => ({
        url: '',
        opacity: 1,
        absolute: false,
        overlayImg: false,
    }),
    methods:{
        showFile(file_type, file_name){
            if(file_type == 'application/pdf'){
                this.urlPdfFiles('UrlFilesAnnounce', file_name)
            }else{
                this.urlFiles('UrlFilesAnnounce', file_name)
            }
        },
        async urlPdfFiles(url,file_name){
            axios({
                url: `/api/get/pdf/${url}`,
                params: {"filename":file_name},
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', file_name);
                    document.body.appendChild(fileLink);

                    fileLink.click();
                    document.body.removeChild(fileLink);
                    window.URL.revokeObjectURL(fileURL);
            });
        },
        async urlFiles(url,file_name){
            let path = `/api/get/${url}?filename=${file_name}`
            let res = await axios.get(`${path}`, { responseType: 'blob' })
            const ext = (file_name.split('.').pop() || '').toLowerCase()
            const mimeByExt = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif' }
            const blob = mimeByExt[ext] ? res.data.slice(0, res.data.size, mimeByExt[ext]) : res.data
            this.url = window.URL.createObjectURL(blob)
            this.overlayImg = !this.overlayImg
        },
    }
}
</script>

<style>
</style>
