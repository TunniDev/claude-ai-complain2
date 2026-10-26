<template>
    <div>
        <v-dialog v-model="dialog" max-width="500">
            <v-toolbar color="#167dc2" theme="dark">
                <v-toolbar-title>{{title}}</v-toolbar-title>
            </v-toolbar>

            <v-list class="pt-2" lines="two">
                <div v-if="files.length">
                <v-list-item
                    v-for="step_file in files"
                    :key="step_file.id"
                    >
                    <div class="d-flex justify-space-between align-center text-left" style="width:100%">
                      <div>{{ step_file.file_original }}</div>
                      <div>
                        <div class="btn-files" v-if="step_file.file_type == 'application/pdf'" @click="urlPdfFiles(path_name,step_file.file_name)"><i class="fa-solid fa-file"></i></div>
                        <div class="btn-files" v-else @click="urlFiles(path_name,step_file.file_name)"><i class="fa-solid fa-image"></i></div>
                      </div>
                    </div>
                </v-list-item>
                </div>
                <h2 v-else>ไม่มีข้อมูล</h2>
            </v-list>
        </v-dialog>

        <!-- โชว์รูป -->
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
    </div>
</template>

<script>
import axios from "axios";
export default {
    props : ['title', 'files', 'path_name'],
    data : () => ({
        overlayImg: false,
        opacity: 1,
        absolute: false,
        dialog: false,
        url: '',
    }),

    methods: {
        open() {
        this.dialog = true
        },
        async urlPdfFiles(path_name ,file_name){
            axios({
                url: `/api/get/pdf/${path_name}`,
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
        async urlFiles(path_name ,file_name){
            let path = `/api/get/${path_name}?filename=${encodeURIComponent(file_name)}`
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
