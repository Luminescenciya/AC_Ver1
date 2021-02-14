<template>
    <section class="EditPrice">
        <div class="card">
            <div class="card__head">
                <span class="card__title">Edit Price For {{this.price.consultation_name}}</span>
                <button onclick="history.back()" class="btn btn-primary">Back to Prices</button>
            </div>
            <div class="card__body">
                <div class="line">
                    <div class="form-group">
                        <div>
                            <label class="control-label">iOS Price</label>
                            <input class="form-control" v-model="ios_billing_id" placeholder="Type Price Here">
                        </div>
                        <div>
                            <label class="control-label">Android Price</label>
                            <input class="form-control" v-model="android_billing_id" placeholder="Type Price Here">
                        </div>
                        <div v-if="price.billing_type!=0">
                            <label class="control-label">Gifts</label>
                            <input type="number" class="form-control" v-model="gifts" placeholder="Type Number of Gifts Here">
                        </div>
                    </div>
                    <div class="form-group">
                        <div>
                            <label class="control-label">Apple Developer Console</label>
                            <button onclick="history.back()" class="btn btn-success">Go To Apple</button>
                        </div>
                        <div>
                            <label class="control-label">Google Developer Console</label>
                            <button onclick="history.back()" class="btn btn-success">Go To Google</button>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <span class="input-group-btn">
                        <button class="btn btn-basic" onclick="history.back()">Cancel</button>
                    </span>
                    <span class="input-group-btn">
                        <button class="btn btn-primary">Save</button>
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import price from './onePrice.json'
export default {
    data: function (){
        return {
            ios_billing_id: '',
            android_billing_id: '',
            gifts:'',
            price:{}
        }
    },
    created(){
        this.price = price;
        this.ios_billing_id = price.ios_billing_id;
        this.android_billing_id = price.android_billing_id;
        this.gifts = price.gifts;
    },
    watch:{
        gifts(){
            if (this.gifts<0) {
                this.gifts = 0;
            } else if (this.gifts>1 && this.price.billing_type==1){
                this.gifts = 1;
            } else if (this.gifts>100){
                this.gifts = 100;
            }
        }
    }
}
</script>
