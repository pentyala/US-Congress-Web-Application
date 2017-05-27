<?php
if(!isset($_GET['op']))
	die("No proper input");
$op=$_GET['op'];
if($op=="legislators"){
	if(!isset($_GET['category']))
		die("Wrong inputs");
	$category=$_GET['category'];
	if($category=="both")
	{
		$category="";
	}
	$json=json_decode(file_get_contents("http://104.198.0.197:8080/legislators?per_page=1&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&chamber=".$category),true);
	$count=$json['count'];
	$pg_no=0;
	$res=array();
	for ($i=0; $i < $count ; $i++) { 
		if($i%50==0)
			$json=json_decode(file_get_contents("http://104.198.0.197:8080/legislators?per_page=50&page=".(++$pg_no)."apikey=1b18e2b4ba5b4865b27980b39d7f47b9&order=state_name__asc&chamber=".$category),true);
		$res['results'][$i]['bioguide_id']=$json['results'][$i%50]['bioguide_id'];
		$res['results'][$i]['first_name']=$json['results'][$i%50]['first_name'];
		$res['results'][$i]['last_name']=$json['results'][$i%50]['last_name'];
		$res['results'][$i]['title']=$json['results'][$i%50]['title'];
		$res['results'][$i]['chamber']=$json['results'][$i%50]['chamber'];
		$res['results'][$i]['party']=$json['results'][$i%50]['party'];
		$res['results'][$i]['state_name']=$json['results'][$i%50]['state_name'];
		$res['results'][$i]['term_start']=$json['results'][$i%50]['term_start'];
		$res['results'][$i]['term_end']=$json['results'][$i%50]['term_end'];
		$res['results'][$i]['district']=$json['results'][$i%50]['district'];
		$start=strtotime($json['results'][$i%50]['term_start']);
		$end=strtotime($json['results'][$i%50]['term_end']);
		$current=strtotime(date("Y-m-d"));
		$res['results'][$i]['progress']=(($current-$start)/($end-$start))*100;
		if(isset($json['results'][$i%50]['facebook_id']))
			$res['results'][$i]['facebook_id']=$json['results'][$i%50]['facebook_id'];
		else
			$res['results'][$i]['facebook_id']=null;
		
		if(isset($json['results'][$i%50]['twitter_id']))
			$res['results'][$i]['twitter_id']=$json['results'][$i%50]['twitter_id'];
		else
			$res['results'][$i]['twitter_id']=null;
		
		if(isset($json['results'][$i%50]['website']))
			$res['results'][$i]['website']=$json['results'][$i%50]['website'];
		else
			$res['results'][$i]['website']=null;
		
		if(isset($json['results'][$i%50]['fax']))
			$res['results'][$i]['fax']=$json['results'][$i%50]['fax'];
		else
			$res['results'][$i]['fax']=null;

		if(isset($json['results'][$i%50]['oc_email']))
			$res['results'][$i]['oc_email']=$json['results'][$i%50]['oc_email'];
		else
			$res['results'][$i]['oc_email']=null;
		
		if(isset($json['results'][$i%50]['phone']))
			$res['results'][$i]['phone']=$json['results'][$i%50]['phone'];
		else
			$res['results'][$i]['phone']=null;
		
		if(isset($json['results'][$i%50]['office']))
			$res['results'][$i]['office']=$json['results'][$i%50]['office'];
		else
			$res['results'][$i]['office']=null;
		
		if(isset($json['results'][$i%50]['birthday']))
			$res['results'][$i]['birthday']=date("m-d-Y",strtotime($json['results'][$i%50]['birthday']));
		else
			$res['results'][$i]['birthday']=null;
	}
	echo json_encode($res);
}
elseif ($op=="committees") {
	if(!isset($_GET['category']))
		die("Wrong inputs");
	$category=$_GET['category'];
	$json=json_decode(file_get_contents("http://104.198.0.197:8080/committees?per_page=50&order=committee_id__asc&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&chamber=".$category),true);
	$count=$json['count'];
	$pg_no=0;
	$res=array();
	for ($i=0; $i < $count ; $i++) { 
		if($i%50==0)
			$json=json_decode(file_get_contents("http://104.198.0.197:8080/committees?per_page=50&order=committee_id__asc&page=".(++$pg_no)."apikey=1b18e2b4ba5b4865b27980b39d7f47b9&chamber=".$category),true);
		$res['results'][$i]['chamber']=$json['results'][$i%50]['chamber'];
		$res['results'][$i]['committee_id']=$json['results'][$i%50]['committee_id'];
		$res['results'][$i]['name']=$json['results'][$i%50]['name'];
		if(isset($json['results'][$i%50]['parent_committee_id']))
			$res['results'][$i]['parent_committee_id']=$json['results'][$i%50]['parent_committee_id'];
		else
			$res['results'][$i]['parent_committee_id']=null;
		if(isset($json['results'][$i%50]['subcommittee']))
			$res['results'][$i]['subcommittee']=$json['results'][$i%50]['subcommittee'];
		else
			$res['results'][$i]['subcommittee']=null;

		if($category=="house")
		{
			if(isset($json['results'][$i%50]['phone']))
				$res['results'][$i]['phone']=$json['results'][$i%50]['phone'];
			else
				$res['results'][$i]['phone']=null;
			
			if(isset($json['results'][$i%50]['office']))
				$res['results'][$i]['office']=$json['results'][$i%50]['office'];
			else
				$res['results'][$i]['office']=null;
		}
	}
	echo json_encode($res);
}
elseif ($op=="bills") {

	if(!isset($_GET['category']))
		die("error");
	if($_GET['category']=="active")
		echo file_get_contents("http://104.198.0.197:8080/bills?per_page=50&history.active=true&last_version.urls.pdf__exists=true&order=introduced_on__desc&apikey=1b18e2b4ba5b4865b27980b39d7f47b9");
	else
		echo file_get_contents("http://104.198.0.197:8080/bills?per_page=50&last_version.urls.pdf__exists=true&history.active=false&order=introduced_on__desc&apikey=1b18e2b4ba5b4865b27980b39d7f47b9");
}
elseif ($op=="legis_comm") {
	if(!isset($_GET['bio_id']))
		die("error at line 135");
	$bio_id=$_GET['bio_id'];
	echo file_get_contents("http://104.198.0.197:8080/committees?per_page=5&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&member_ids=".$bio_id);
}
elseif ($op=="legis_bills") {
	if(!isset($_GET['bio_id']))
		die("error at line 141");
	$bio_id=$_GET['bio_id'];
	$json = json_decode(file_get_contents("http://104.198.0.197:8080/bills?per_page=5&apikey=1b18e2b4ba5b4865b27980b39d7f47b9&sponsor_id=".$bio_id),true);
	for($i=0;$i<count($json['results']);$i++)
	{
		if(!isset($json['results'][$i]['last_version']['urls']['pdf']))
			$json['results'][$i]['last_version']['urls']['pdf']=null;
	}
	echo json_encode($json);
}
else{
	echo '<script>alert("error")';
}
?>