<template>
    <section class="Publications">
        <div class="card">
            <div class="card__head">
                <span class="card__title">In developing</span>
                <!-- <span class="card__title">Publications</span>
                <router-link :to="{ name: 'NewPublication' }" tag="button" class="btn btn-primary">New Publication</router-link> -->
            </div>
            <!-- <div class="card__body">
                <div class="table-responsive">
                    <table class="table no-margin">
                        <thead>
                            <tr>
                                <th class="MenuUsersName">NAME</th>
                                <th>DESCRIPTION</th>
                                <th>LANGUAGE</th>
                                <th>PUBLICATION DATE</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr :key="i" v-for="(publ, i) in listOfPublications">
                                <td>{{publ.name}}</td>
                                <td>{{publ.description}}</td>
                                <td>{{publ.language_code}}</td>
                                <td>{{publ.publication_date}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div> --><!--end .card__body -->
        </div>
    </section>
</template>

<script>
import publications from './publications.json'
export default {
    data: function() {
        return {
            listOfPublications:[],
        }
    },
    created(){
        this.listOfPublications = publications.publications
    }
}
</script>