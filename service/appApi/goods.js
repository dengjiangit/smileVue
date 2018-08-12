const Router = require('koa-router')
let router = new Router()

const mongoose = require('mongoose')
const fs = require('fs')
//  fs.readFile('./goods.json', 'utf8', function(err, data){
 
//     let newData= JSON.parse(data)
//     console.log(typeof newData)
//     let i=0
//     let pushData=[]
//     newData.RECORDS.map(function(value,index){
//         if(value.IMAGE1!=null){
//             i++
//             console.log(value.NAME)
//             pushData.push(value)
//         }  
//     })
//      fs.writeFile('./newGoods.json',JSON.stringify(pushData),function(err){
//          if(err) console.log('写文件操作失败');
//          else console.log('写文件操作成功');
//      });
// });
router.get('/insertAllGoodsInfo',async(ctx)=>{
    fs.readFile('./newGoods.json','utf8',(err,data)=>{
        data=JSON.parse(data)
        let saveCount=0
        const Goods = mongoose.model('Goods')
        data.map((value,index)=>{
            console.log(value)
            let newGoods = new Goods(value)
            newGoods.save().then(()=>{
                saveCount++
                console.log('成功'+saveCount)
            }).catch(error=>{
                console.log(MediaStreamErrorEvent)
            })
        })
    })
    ctx.body="开始导入数据"
})

router.get('/insertAllCategory',async(ctx)=>{
    fs.readFile('./data_json/category.json','utf8',(err,data)=>{
        data=JSON.parse(data)
        let saveCount=0
        const Category = mongoose.model('Category')
        data.RECORDS.map((value,index)=>{
            console.log(value)
            let newCategory = new Category(value)
            newCategory.save().then(()=>{
                saveCount++
                console.log('插入成功:'+saveCount)
            }).catch(error=>{
                console.log('插入失败:'+error)
            })
        })

    })
    ctx.body="开始导入数据....."
})

router.get('/insertAllCategorySub',async(ctx)=>{
    fs.readFile('./data_json/category_sub.json','utf8',(err,data)=>{
        data=JSON.parse(data)
        let saveCount=0
        const CategorySub = mongoose.model('CategorySub')
        data.RECORDS.map((value,index)=>{
            console.log(value)
            let newCategorySub = new CategorySub(value)
            newCategorySub.save().then(()=>{
                saveCount++
                console.log('插入成功:'+saveCount)
            }).catch(error=>{
                console.log('插入失败:'+error)
            })
        })

    })
    ctx.body="开始导入数据....."
})

//**获取商品详情信息的接口
router.post('/getDetailGoodsInfo',async(ctx)=>{
    try{
        let goodsId = ctx.request.body.goodsId
        const Goods = mongoose.model('Goods')
        let result= await Goods.findOne({ID:goodsId}).exec()
        ctx.body={code:200,message:result}
    }catch(error){
        ctx.body={code:500,message:error}
    }
})
//获取大类信息
router.get('/getCategoryList',async(ctx)=>{
    try{
        const Category =mongoose.model('Category')
        let result = await Category.find().exec()
        ctx.body={code:200,message:result}
    }catch(err){
        ctx.body={
            code:500,
            message:err
        }
    }
})
router.post('/getCategorySubList',async(ctx)=>{
    try{
        let categoryId = ctx.request.body.categoryId
        const CategorySub = mongoose.model('CategorySub')
        let result = await CategorySub.find({MALL_CATEGORY_ID:categoryId}).exec()
        ctx.body={code:200,message:result}
    }catch(err){
        ctx.body={code:500,message:err}
    }
 
})
//获取小类信息
    
router.post("/getGoodsListByCategorySubID",async(ctx)=>{
    try{
        let categorySubId =ctx.request.body.categorySubId//小类别
        let page =ctx.request.body.page
        let num =10
        let start =(page-1)*num
        const Goods =mongoose.model("Goods")
        let result =await Goods.find({SUB_ID:categorySubId}).skip(start).limit(num).exec()
        console.log(result.length)
        ctx.body={
            code:200,
            message:result
        }
    }catch(err){
        console.log(err)
        ctx.body={
            code:500,
            message:err
        }
    }
   

})


module.exports = router