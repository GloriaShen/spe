<?php
require_once '../o2o/connect.php';
require_once 'config.php';
require_once '/data/wwwroot/weilink.huaxi100.com/hxdsb/hxsd/Wxauth.php';
require_once 'user.php';

if(strpos($_SERVER['HTTP_USER_AGENT'], "icroMessenger")){
    $auth = Wxauth::getInstance($config['APPID'], $config['SECRET']);
    $user = new User($auth, $config);
    
    $userinfo = $user->initUser();
    if ($userinfo == 'refresh') $userinfo = $user->initUser(true);
    
    if(!isset($_COOKIE['wxopenid'])){
        setcookie('wxopenid',$userinfo['wecha_id'],time()+86400);
    }
    if(!isset($_COOKIE['wxuserinfo'])){
        setcookie('wxuserinfo',json_encode($userinfo),time()+86400);
    }
    
    $signPackage = $auth->getSignPackage();
}
$page = ((int)$_GET['page'])?:1;

$describs=[
    '年度城市人物：代表成都，传播城市的温度',
    '年度城市动力：四通八达，让城市更快更好',
    '年度城市声音：万物有声，用耳朵了解成都',
    '年度城市文化：古今中外，在这里一瞬永恒',
    '年度城市形象：各行各业，多的是你不知道的事',
    '年度城市纪念：岁月有痕，感谢与你相识一场',
    '年度城市出行：新的时代，需要新的出行方式',
    '年度城市创新：孵化梦想，让创意变成现实',
];

$html=<<<html
<h1 class="title title-$page"><span>年度城市人物</span></h1>
<div class="avatar"></div>
<p class="summary">
    {$describs[$page-1]}
</p>
html;



include 'detail.html';