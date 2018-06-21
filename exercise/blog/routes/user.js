var express=require('express');
var index=express.Router();
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/blog');
const account = mongoose.model('account', { name: String ,password : String,email:String});
const p=mongoose.model('post',{name:String,post:String,code:Number,title:String});
var number=0;
function unchecklogin(req,res,next)
{
    if(req.session.body==null)
    {
        return res.redirect('/');
    }
    next();
}
index.get('/',(req,res)=>
{
    p.find({},function(err,docs){
        if(err)console.err(err);
        res.render('index',{
            title:'主頁',
            success:req.flash('success').toString(),
            error:req.flash('error').toString(),
            user: req.session.body,
            posts:docs,
        });
    })
})
index.get('/login',(req,res)=>{
    res.render('login',{title:'Login',
    success:req.flash('success').toString(),
        error:req.flash('error').toString(),
        user:req.session.body
    })
})
index.get('/reg',(req,res)=>{
    res.render('reg',{title:'Register',
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
    user:req.session.body
    });
    res.end();
}) 
index.post('/login',(req,res)=>{
    account.findOne({'name':req.body.name},function(err,account1){
        if(err) console.error(err);
        if(account1)
            if(account1.password==req.body.password)
            {
                req.session.body=req.body;
                req.flash('success','登入成功');
                res.redirect('/');
            }
            else
            {
                req.flash('error','登入失敗');
                res.redirect('/login');
            }
    })
})
index.post('/reg',(req,res)=>{
    if (req.body.password != req.body['password-repeat']) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/reg');//返回注册页
      }
    account.findOne({'name': req.body.name},function(err,account1){
        if(account1==null)
        {
            var user=new account({name:req.body.name,password:req.body.password,email:req.body.email});
            user.save();
            req.session.body=req.body;
            req.flash('success', '注册成功!');
            return res.redirect('/');   
        }
        else
        {
            req.flash('error','此名稱已使用過');
            res.redirect('/reg');
        }
    })
})
index.get('/logout',(req,res)=>{
    req.session.body=null;
    req.flash('success','登出成功')
    res.redirect('/');
})
index.get('/post',unchecklogin,(req,res)=>{
    res.render('post',{
    title:'Post',
    user:req.session.body,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
    })
})
index.post('/post',(req,res)=>{
        p.find({},function(err,doce){
            number=doce.length
            post1=new p({"name":req.session.body.name,'post':req.body.post,'code':number,'titile':req.body.title});
            post1.save();
            req.flash('success','發布成功');
            res.redirect('/');
        })
    /*else
    {
        p.update({code:'code'},{$set:{'post':req.body.post,'titile':req.body.title}},function(err)
        {
            if(err)
            console.log(err);
            res.redirect('/');
        });
    }
    */
})
index.get('/delet/:code',function(req,res){
    p.deleteOne({'code':req.params.code},function(err){
        if(err)console.error(err)
        return;
    })
    res.redirect('/');
})
index.get('/edit/:code',function(req,res){
    res.render('post',{
        title:'Post',
        user:req.session.body,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        })
})
index.post('/edit/:code',function(req,res){
    p.update({code:req.params.code},{$set:{'post':req.body.post,'titile':req.body.title}},function(err)
    {
        if(err)
        console.log(err);
        res.redirect('/');
    })
})
module.exports=index;