<?php
require_once '../o2o/connect.php';
require_once 'config.php';
require_once '/data/wwwroot/weilink.huaxi100.com/hxdsb/hxsd/Wxauth.php';
require_once 'user.php';

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

include 'index.html';
