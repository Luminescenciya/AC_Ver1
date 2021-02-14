<template>
    <section class="PriceList">
        <div class="card">
        <div class="card__head">
            <!-- <span class="card__title">Price list</span> -->
            <span class="card__title">In developing</span>
        </div>
        <!-- <div class="card__body">
            <div class="table-responsive">
                <table class="table no-margin">
                    <thead>
                        <tr>
                            <th class="MenuUsersName">NAME</th>
                            <th>IOS BILLING ID</th>
                            <th>ANDROID BILLING ID</th>
                            <th>GIFTS</th>
                            <th>LAST EDIT</th>
                            <th class="MenuUsersInfo">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr :key="i" v-for="(price, i) in prices">
                            <td>{{price.consultation_name}}</td>
                            <td>{{price.ios_billing_id}}</td>
                            <td>{{price.android_billing_id}}</td>
                            <td>{{price.gifts}}</td>
                            <td>{{price.last_edit}}</td>
                            <td>
                                <router-link :to="{ name: 'EditPrice', params:{id: price.consultation_name.replace(/\s/g, '')}}"><span class="fa fa-pencil fa-2x"></span></router-link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div> --><!--end .card__body -->
        </div><!--end .card -->
    </section>
</template>

<script>
import priceList from './prices.json'
export default {
    data: function(){
        return{
            prices:[]
        }
    },
    created(){
        this.prices = priceList.prices
    }
}
</script>