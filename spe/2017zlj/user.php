<?php

class Enc{
    
    public static function encode($string){
        //return $string;
        if ($string)return base64_encode(serialize($string).'npv8qn34p2998hb');
    }
    public static function decode($string){
        //return $string;
        if ($string)return unserialize(base64_decode($string.'npv8qn34p2998hb'));
    }
    
    public static function curlGet($url){
        //初始化
        $curl = curl_init();
        //设置抓取的url
        curl_setopt($curl, CURLOPT_URL, $url);
        //设置获取的信息以文件流的形式返回，而不是直接输出。
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        //执行命令
        $data = curl_exec($curl);
        //关闭URL请求
        curl_close($curl);
        //显示获得的数据
        return $data;
    }
}

class User {
    
    public $auth,$config;
    
    public function __construct($auth,$config){
        $this->auth = $auth;
        $this->config = $config;
    }
    
    public function initUser($refresh,$wecha_id){
        if($wecha_id != ''){
            $openid = $wecha_id;
            $userinfo['openid'] =  $openid;
        }else{
            $openid = $this->auth->getOpenid('',false);
            if(!$openid || $refresh){
                $userinfo = $this->auth->getUserInfo();
                $openid = $userinfo['openid'];
            }
        }
        
        
        $sql = "SELECT * FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$openid}' AND game_name = '{$this->config['GAME_NAME']}'";
        $is_user = $this->get_one($sql);
        
        if(!$is_user){
            if(!$userinfo || !$userinfo['openid']) return 'refresh';
            $nowtime = time();
            $sql = "insert into tp_hx_o2ouser
                      (`wecha_id`,`nickname`,`headimgurl`,`createtime`,`game_name`,`score`)
                      values
                      ('{$userinfo['openid']}','{$userinfo['nickname']}','{$userinfo['headimgurl']}',{$nowtime},'{$this->config['GAME_NAME']}',1000)";
            $ck = $this->get_one($sql);
            $userinfo['wecha_id'] = $userinfo['openid'];
            
            return $userinfo;
        }
        
        return $is_user;
    }
    
    /**
     * @param $wecha_id
     * @param $game_id
     * 用户点击开启详情页面的是 添加玩过的id
     */
    public function updateInfo($wecha_id,$game_id){
        $sql_sr = "SELECT location FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$wecha_id}'  AND game_name ='20170401'";
        $info = $this->get_one($sql_sr);
        if($info['location']){
            $location = $info['location'].','.$game_id;
        }else{
            $location = $game_id;
        }
        $sql = "UPDATE `tp_hx_o2ouser` SET `location`='{$location}' WHERE `wecha_id`='{$wecha_id}'  AND game_name ='20170401'";
        $result = $this->query($sql);
        return $result;
    }
    
    /**
     * @param $wecha_id
     * @param $game_id
     * 判断是否进入过这个游戏
     */
    public function checkInGame($wecha_id,$game_id){
        $sql_sr = "SELECT location FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$wecha_id}'  AND game_name ='20170401'";
        $info = $this->get_one($sql_sr);
        $game_id_arr = explode(',',$info['location']);
        if(in_array($game_id,$game_id_arr)){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * @param $from_uid
     * @param $game_id
     * @param $wecha_id
     * 进入别人玩的游戏
     */
    public function inGame($from_uid,$game_id,$wecha_id){
        $sql1 = "SELECT * FROM `tp_hx_o2ouserlog` WHERE fromid=$from_uid and flag=$game_id and toid='{$wecha_id}' AND  game_name='20170401'";
        $info = $this->get_one($sql1);
        if(empty($info)){
            $time = time();
            $sql = "insert into tp_hx_o2ouserlog
                      (`toid`,`fromid`,`createtime`,`game_name`,`flag`)
                      values
                      ('{$wecha_id}','{$from_uid}','{$time}','20170401','{$game_id}')";
            $this->query($sql);
        }
    }
    
    /**
     * @param $from_uid
     * @param $game_id
     * 玩游戏人列表
     */
    public function listGameUser($from_uid,$game_id){
        $sql = "SELECT * FROM `tp_hx_o2ouserlog` WHERE fromid=$from_uid and flag=$game_id AND  game_name='20170401'";
        $result= $this->get_all($sql);
        $list = $row = [];
        foreach($result as $row){
            $r = $this->getUserI($row['toid']);
            $list[] = $r;
        }
        return $list;
    }
    
    /**
     * @param $wecha_id
     * 获取用户信息
     */
    public function getUserI($wecha_id){
        $sql_sr = "SELECT * FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$wecha_id}'  AND game_name ='20170401'";
        $info = $this->get_one($sql_sr);
        return $info;
        
    }
    
    public function saveInfo($wecha_id,$data){
        $rs = false;
        $phone = $data['phone'];
        $sex = $data['sex'];
        //$name = mysql_real_escape_string($name);
        //if(!is_numeric($phone) || strlen($phone) != 11) return false;
        $sql_sr = "SELECT * FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$wecha_id}' AND game_name = '{$this->config['GAME_NAME']}' LIMIT 1";
        $info = $this->get_one($sql_sr);
        if($info){
            $sql = "UPDATE `tp_hx_o2ouser` SET `phone`={$phone},`location`={$sex} WHERE id=".$info['id'];
            $result = $this->query($sql);
            if($result){
                $rs = true;
            }
        }
        return $rs;
    }
    
    public function updateExchage($openid,$flag){
        if(!$openid || !in_array($flag,array(0,1,2))) return false;
        
        $sql_sr = "SELECT * FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$openid}' AND game_name = '{$this->config['GAME_NAME']}' LIMIT 1";
        $info = $this->get_one($sql_sr);
        
        if($info){
            $sql = "UPDATE `tp_hx_o2ouser` SET `flag`={$flag} WHERE `wecha_id`='{$openid}' AND `game_name`='{$this->config['GAME_NAME']}' LIMIT 1";
            $result = $this->get_one($sql);
            return true;
        }else{
            return false;
        }
    }
    
    public function tjLog(){
        
        $sql1 = "SELECT count(*) as cou FROM `tp_hx_o2ouser` WHERE  game_name = 'brc-love'";
        $result1 = $this->get_one($sql1);
        $data['cou_all'] = $result1['cou'];
        $sql2 = "SELECT count(*) as cou FROM `tp_hx_o2ouser` WHERE flag=1 AND  game_name = 'brc-love'";
        $result2= $this->get_one($sql2);
        $data['cou_win'] = $result2['cou'];
        $sql3 = "SELECT * FROM `tp_hx_o2ouser` WHERE flag=1 and score>0 AND  game_name = 'brc-love'";
        $result3= $this->get_all($sql3);
        $data['list'] = $result3;
        return $data;
    }
    public function get_one($sql){
        include 'connet.php';
        $resource = mysql_query($sql);
        $r = NULL;
        if($resource){
            $r = mysql_fetch_assoc($resource);
        }
        return $r;
    }
    
    private function get_all($sql){
        include 'connet.php';
        $resource = mysql_query($sql);
        while($row = mysql_fetch_assoc($resource)){
            $result[] = $row;
        }
        
        return $result;
    }
    
    /**
     * 过滤数据库拼接参数
     */
    private function filterData($data=""){
        return mysql_real_escape_string($data);
    }
    
    private function query($sql){
        include 'connet.php';
        $resource = mysql_query($sql);
        return $resource;
    }
    
    public function updateUserAvatar($userinfo)
    {
        $openid=$userinfo['wecha_id'];
        $sql_sr = "SELECT `extend` FROM `tp_hx_o2ouser` WHERE `wecha_id`='{$openid}' AND game_name = '{$this->config['GAME_NAME']}' LIMIT 1";
        $avatarSaved = $this->get_one($sql_sr);
        //$avatarSaved['extend']=false;
        if($avatarSaved['extend']){
            $img = urldecode($avatarSaved['extend']);
        }else{
            require_once 'image.php';
            $imgH = new Image();
            $baseImg=__DIR__.'/assets/basic.jpg';
            $avatar = $userinfo['headimgurl'];
            $name = $userinfo['nickname'];
            
            $file=self::curlGet($avatar);
            $fileName = __DIR__.'/assets/poster/'.mb_substr(md5($avatar),0,10).'.jpg';
            file_put_contents($fileName,$file);
            //$avatar = __DIR__.'/assets/avatar.jpg';//TODO::deleteme
            
            //海报图片地址
            $img = $imgH->createPoster($baseImg,$fileName,$name,$this->sinaurl($this->config['share_url'].'?from_uid='.Enc::encode($openid)));
            if($img){
                $save_img = urlencode($img);
                $sql = "UPDATE `tp_hx_o2ouser` SET `extend`='{$save_img}' WHERE `wecha_id`='{$openid}' AND `game_name`='{$this->config['GAME_NAME']}' LIMIT 1";
                $result = $this->get_one($sql);
            }
        }
        return $img;
    }
    
    private function sinaurl($url, $key = '947630695') {
        $opts['http'] = array('method' => "GET", 'timeout'=>60);
        $context = stream_context_create($opts);
        $url = "http://api.t.sina.com.cn/short_url/shorten.json?source=$key&url_long=$url";
        $html =  @file_get_contents($url,false,$context);
        $url = json_decode($html,true);
        if (!empty($url[0]['url_short'])) {
            return $url[0]['url_short'];
        }
    }
    
    private static function curlGet($url)
    {
        $ch = curl_init();
        curl_setopt ($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT,10);
        $content = curl_exec($ch);
        return $content;
    }
    
    
    
    public function updateUserInflu($from_uid,$wecha_id,$score=100)
    {
        if(!$from_uid || !$wecha_id)return false;
        
        $sql1 = "SELECT * FROM `tp_hx_o2ouser` WHERE  `wecha_id` = '$from_uid' AND  game_name='{$this->config['GAME_NAME']}'";
        $result1 = $this->get_one($sql1);
        if(!$result1)return false;
        
        $sql1 = "SELECT * FROM `tp_hx_o2ouserlog` WHERE fromid='$from_uid' and toid='{$wecha_id}' AND  game_name='{$this->config['GAME_NAME']}'";
        $info = $this->get_one($sql1);
        if(empty($info)){
            $time = time();
            $sql = "insert into tp_hx_o2ouserlog
                      (`toid`,`fromid`,`createtime`,`game_name`,`score`)
                      values
                      ('{$wecha_id}','{$from_uid}','{$time}','{$this->config['GAME_NAME']}','{$score}')";
            $this->query($sql);
            
            $sql = "UPDATE `tp_hx_o2ouser` SET `score`=`score`+$score WHERE `wecha_id`='{$from_uid}' AND `game_name`='{$this->config['GAME_NAME']}' LIMIT 1";
            $this->query($sql);
        }
    }
    
    public function updateUserUpperInflu($from_uid,$wecha_id){
        $sql1 = "SELECT `fromid` FROM `tp_hx_o2ouserlog` WHERE toid='$from_uid' AND game_name='{$this->config['GAME_NAME']}'";
        $info = $this->get_one($sql1);
        if($info['fromid']){
            return $this->updateUserInflu($info['fromid'],$wecha_id,10);
        }
    }
    
    public function updateUserUpperInfluOld()
    {
        //获取所有
        $sql1 = "SELECT `fromid`,`toid` FROM `tp_hx_o2ouserlog` WHERE game_name='{$this->config['GAME_NAME']}' and createtime < '1494299424'";
        $info = $this->get_all($sql1);
        foreach ($info as $item) {
            $sql2 = "SELECT `fromid` FROM `tp_hx_o2ouserlog` WHERE `toid` = '{$item['fromid']}' and game_name='{$this->config['GAME_NAME']}'";
            $singleInfo = $this->get_one($sql2);
            if($singleInfo['fromid']){
                //$list[]=$this->updateUserInflu($singleInfo['fromid'],$item['toid'],10);
                //$list[]=[$singleInfo['fromid'],$item['toid']];
                
            }
        }
        var_dump($list);exit;
    }
    
    public function getTopUserInflu()
    {
        $sql1 = "SELECT *
FROM  `tp_hx_o2ouser`
WHERE  `game_name` =  '2017cxo'
ORDER BY  `tp_hx_o2ouser`.`score` DESC
LIMIT 0 , 30";
        $info = $this->get_all($sql1);
    }
    
    public function getOverRate($score)
    {
        $over_count = $this->get_one("select count(wecha_id)  AS rank from (SELECT *,max(score) as total_score FROM `tp_hx_o2ouser`  WHERE `game_name`='{$this->config['GAME_NAME']}' group by wecha_id ) as checkin where total_score >{$score}");
        
        $users_count = $this->get_one("select count(*) as c from `tp_hx_o2ouser` WHERE `game_name`='{$this->config['GAME_NAME']}' ");
        $over_rate =((1- number_format($over_count['rank']  / $users_count['c'], '3'))*100). '%';
        return $over_rate;
    }
    
    public function createRobotUser($userCount,$score)
    {
        
        $time=time();
        $count = $userCount;
        $values = [];
        for($i=0;$i<$count;$i++){
            $userinfo=[
                'openid'=>$this->generate_password(28),
                'nickname'=>'fake_'.$this->generate_password(5),
                'headimgurl'=>'no_head_img_url',
            ];
            $values[]="('{$userinfo['openid']}','{$userinfo['nickname']}','{$userinfo['headimgurl']}',{$time},'2017cxo',$score)";
            $valuestring = implode(',',$values);
        }
        
        $sql = "insert into tp_hx_o2ouser
    (`wecha_id`,`nickname`,`headimgurl`,`createtime`,`game_name`,`score`) values $valuestring";
        $this->query($sql);
    }
    
    private function generate_password($length = 8)
    {
        // 密码字符集，可任意添加你需要的字符
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= $chars[mt_rand(0,strlen($chars) - 1)];
        }
        return $password;
    }
    
}



