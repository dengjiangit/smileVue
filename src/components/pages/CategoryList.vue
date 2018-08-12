<template>
    <div>
        <div class="navbar-div">
             <van-nav-bar   title="类别列表" left-text="返回" left-arrow @click-left="onClickLeft"/> 
        </div>
        <van-row>
            <van-col span="6">
                <div id="leftNav">
                    <ul>
                        <li v-for="(item,index) in category" :key="index" @click="clickCategory(index,item.ID)" :class="{categoryActice:categoryIndex==index}">{{item.MALL_CATEGORY_NAME}}</li>
                    </ul>
                </div>
            </van-col>
            <van-col span="18">
              <div class="tabCategorySub">
                <van-tabs v-model="active" @click="onClickCategorySub">
                    <van-tab v-for="(item, index) in categorySub" :key="index" :title="item.MALL_SUB_NAME">
                        
                    </van-tab>
                </van-tabs>
                <div id="list-div" >
                    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
                        <van-list v-model="loading" :finished="finished" @load="onLoad">
                            <div class="list-item" @click="goGoodsInfo(item.ID)" v-for="(item,index) in goodList" :key="index">
                                <div class="list-item-img">
                                    <img :src="item.IMAGE1" 
                                    width="100%" :onerror="errorImg"/></div>
                                <div class="list-item-text">
                                    <div>{{item.NAME}}</div>                                    
                                    <div>￥{{item.ORI_PRICE | moneyFilter}}</div>                                    
                                 </div>
                            </div>
                        </van-list>
                    </van-pull-refresh>
                </div>
            </div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import axios from 'axios'
import { Toast } from 'vant'
import url from '@/serviceAPI.config.js'
 import {toMoney} from '@/filter/moneyFilter.js'
    export default {
        name:'categoryList',
        data(){
            return{
                category:[],
                categoryIndex:0,
                categorySub:[],
                active:0,    //激活标签的值
                list:[],
                loading:false,   //上拉加载使用
                finished:false,  //下拉加载是否没有数据了
                isRefresh:false, //下拉加载
                page:1,          //商品列表的页数
                goodList:[],     //商品信息
                categorySubId:'', //商品子分类ID
                errorImg:'this.src="'+require('@/assets/images/errorimg.png')+'"',
            }
        },
        methods:{
            onClickLeft(){
                this.$router.go(-1);
            },
            getCategory(){
                axios({
                    methods:'get',
                    url:url.getCategoryList
                }).then((respone)=>{
                    if(respone.data.code==200&&respone.data.message){
                            this.category=respone.data.message
                            this.getCategotySubByCategoryId(this.category[0].ID)
                    }
                }).catch((err)=>{

                })
            },
            clickCategory(index,categoryId){
                this.categoryIndex=index
                this.page=1
                this.finished = false
                this.goodList=[]
            this.getCategotySubByCategoryId(categoryId)
                },
                getCategotySubByCategoryId(categoryId){
                    axios({
                        url:url.getCategorySubList,
                        method:'post',
                        data:{categoryId:categoryId}
                    }).then((request)=>{
                        if(request.data.code==200&&request.data.message){
                             this.categorySub=request.data.message
                                this.active=0
                                 this.categorySubId = this.categorySub[0].ID
                                 this.onLoad()
                        }
                    }).catch((err)=>{
                         Toast(err)
                    })
                },
                onLoad(){
                    setTimeout(()=>{
                      this.categorySubId = this.categorySubId?this.categorySubId:this.categorySub[0].ID
                   this.getGoodList()
                    },500)
                },
                onRefresh(){
                    setTimeout(() => {
                        this.isRefresh = false;
                        this.finished = false;
                        this.goodList=[];
                        this.page=1
                        this.onLoad()
                    }, 500);
                },
                getGoodList(){
                    axios({
                        url:url.getGoodsListByCategorySubID,
                        method:'post',
                        data:{
                             categorySubId:this.categorySubId,
                             page:this.page
                        }
                    }).then((response)=>{
                        console.log(response)
                        if(response.data.code==200&&response.data.message.length){
                            this.page++;
                            this.goodList=this.goodList.concat(response.data.message)
                        }else{
                            this.finished=true;
                        }
                         this.loading = false;
                    }).catch((err)=>{
                         console.log(err)
                    })
                },
                onClickCategorySub(index,title){
                    console.log(this.categorySub)
                    this.categorySubId =this.categorySub[index].ID
                    this.goodList=[]
                    this.finish=false
                    this.page=1
                     this.onLoad()

                },
                goGoodsInfo(id){
                    this.$router.push({name:'Goods',params:{goodsId:id}})
                }
        },
        created(){
            this.getCategory()
        },
        filters:{
            moneyFilter(money){
                return toMoney(money)
            }
        },
        mounted(){
            let winHeight = document.documentElement.clientHeight
            document.getElementById("leftNav").style.height= winHeight-46-50 +'px'
            document.getElementById('list-div').style.height=winHeight-90-50+'px'
              //this.getCategotySubByCategoryId(this.category[0].ID)
    }
    }
</script>

<style scoped>
    #leftNav{
        background-color: aliceblue;
    }
    #leftNav ul li {
        line-height: 2rem;
        border-bottom: 1px solid #E4E7ED;
        padding:3px;
        font-size:0.8rem;
        text-align: center;
    }
    .categoryActice{
        background-color: #fff;
    }
    .list-item{
        display: flex;
        flex-direction: row;
        font-size:0.8rem;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        padding:5px;
    }
    #list-div{
        overflow: scroll;
    }
    .list-item-img{
        flex:8;
    }
    .list-item-text{
        flex:16;
        margin-top:10px;
        margin-left:10px;
    }
   
</style>