var app = angular.module('congress', ['angularUtils.directives.dirPagination']);
$(document).ready(function(){
    $("#Legislators_Carousel").carousel({interval:false});
    $("#Favorites_Carousel").carousel({interval:false});
    $("#Bills_Carousel").carousel({interval:false});
    $("#Bills_Carousel").carousel(0);
    $("#Legislators_Carousel").carousel(1);
    $("#Legislators_Carousel").carousel("prev");
    $("#Committees").hide();
    $("#Legislators").show();
    $("#Bills").hide();
    $("#Favorites").hide();
    $("#toggle-menu").click(function(e){
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $("#1toggle-menu").click(function(e){
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $("#legis_menu").click(function(){
        $("#Committees").hide();
        $("#Legislators").show();
        $("#Bills").hide();
        $("#Favorites").hide();
    });
    $("#comm_menu").click(function(){
        $("#Committees").show();
        $("#Legislators").hide();
        $("#Bills").hide();
        $("#Favorites").hide();
    });
    $("#bills_menu").click(function(){
        $("#Committees").hide();
        $("#Legislators").hide();
        $("#Bills").show();
        $("#Favorites").hide();
    });
    $("#favs_menu").click(function(){
        $("#Committees").hide();
        $("#Legislators").hide();
        $("#Bills").hide();
        $("#Favorites").show();
    });
    $("#bills_back_button").click(function(){
        $("#Bills_Carousel").carousel("prev");
    });
    $("#fbills_back_button").click(function(){
        $("#Favorites_Carousel").carousel(0);
    });
    $("#flegis_back_button").click(function(){
        $("#Favorites_Carousel").carousel(0);
    });
    $("#legis_back_button").click(function(){
        $("#legis_committees").html("<tr><th>Chamber</th><th>Committee ID</th><th class=\"hidden-xs\">Name</th></tr>");
        $("#legis_bills").html("<tr><th>Bill ID</th><th class=\"hidden-xs\">Title</th><th class=\"hidden-xs\">Chamber</th><th class=\"hidden-xs\">Congress</th><th>Link</th></tr>")
        $("#Legislators_Carousel").carousel("prev"); 
    });
    $("#legis_fav_button").click(function(){
        if($("#legis_fav_icon").attr("class")=="fa fa-star-o")
        {
            var res=(localStorage.getItem("hw_leg"));
            var bioid=$("#temp_leg_bio_id").html();
            for(i=0;i<full_legislators_data.length;i++)
            {
                if(full_legislators_data[i].bioguide_id==bioid)
                {
                    if(res=="null"||res==null)
                        res=[full_legislators_data[i]];
                    else{
                        res=JSON.parse(res);
                        res.push(full_legislators_data[i]);
                    }
                    break;
                }
            }
            localStorage.setItem("hw_leg",JSON.stringify(res));
            $("#legis_fav_icon").attr("class","fa fa-star");
            $("#legis_fav_icon").css("color","rgb(230, 230, 71)");
        }
        else
        {
            var res=(localStorage.getItem("hw_leg"));
            var bioid=$("#temp_leg_bio_id").html();
            for(i=0;i<full_legislators_data.length;i++)
            {
                if(full_legislators_data[i].bioguide_id==bioid)
                {
                    res=JSON.parse(res);
                    res.splice(i,1);
                    break;
                }
            }
            localStorage.setItem("hw_leg",JSON.stringify(res));
            $("#legis_fav_icon").attr("class","fa fa-star-o");
            $("#legis_fav_icon").css("color","#ccc");
        }
    });
    $("#comm_fav_button").click(function(){
    });
    $("#bills_fav_button").click(function(){
        if($("#bills_fav_icon").attr("class")=="fa fa-star-o")
        {
            var res=(localStorage.getItem("hw_bill"));
            var billid=$("#temp_bill_bill_id").html();
            flag=0;
            for(i=0;i<full_bill_data_active.length;i++)
            {
                if(full_bill_data_active[i].bill_id==billid)
                {
                    flag=1;
                    if(res=="null"||res==null)
                        res=[full_bill_data_active[i]];
                    else{
                        res=JSON.parse(res);
                        res.push(full_bill_data_active[i]);
                    }
                    break;
                }
            }
            for(i=0;i<full_bill_data_old.length;i++)
            {
                if(flag==1)
                    break;
                if(full_bill_data_old[i].bill_id==billid)
                {
                    flag=1;
                    if(res=="null"||res==null)
                        res=[full_bill_data_old[i]];
                    else{
                        res=JSON.parse(res);
                        res.push(full_legislators_data[i]);
                    }
                    break;
                }
            }
            localStorage.setItem("hw_bill",JSON.stringify(res));
            $("#bills_fav_icon").attr("class","fa fa-star");
            $("#bills_fav_icon").css("color","rgb(230, 230, 71)");

        }
        else
        {
            $("#bills_fav_icon").attr("class","fa fa-star-o");
            $("#bills_fav_icon").css("color","#ccc");
        }
    });
});
var full_legislators_data;
var full_bill_data_active,full_bill_data_old;
app.controller('legis_ctrl_state',function($scope,$http){
    var page_num=1;
    var i=0;
    var temp=null;
    var legis_house=[],legis_senate=[];
    $http.get("index.php?op=legislators&category=both").success(function(response){
        $scope.leg_state_data=response.results;
        for(p in response.results)
        {
            if(response.results[p].chamber=="senate")
                legis_senate.push(response.results[p]);
            else
                legis_house.push(response.results[p]);
        }
        $scope.leg_house_data=legis_house;
        $scope.leg_senate_data=legis_senate;
        full_legislators_data=response.results;
    });
    $scope.vd=function(bio_id){
        $http.get("index.php?op=legis_comm&bio_id="+bio_id).success(function(){
            if(isFav(bio_id,0))
            {
                $("#legis_fav_icon").attr("class","fa fa-star");
                $("#legis_fav_icon").css("color","rgb(230, 230, 71)");
            }
            else
            {
                $("#legis_fav_icon").attr("class","fa fa-star-o");
                $("#legis_fav_icon").css("color","#ccc");
            }
            for(i=0;i<full_legislators_data.length;i++)
            {
                if(bio_id==full_legislators_data[i].bioguide_id)
                {
                    $("#temp_leg_bio_id").html(bio_id);
                    $("#leg_image").attr("src","https://theunitedstates.io/images/congress/original/"+full_legislators_data[i].bioguide_id+".jpg");
                    $("#leg_name").html(full_legislators_data[i].title+". "+full_legislators_data[i].last_name+", "+full_legislators_data[i].first_name);
                    $("#leg_mail").html(full_legislators_data[i].oc_email);
                    $("#leg_mail").attr("href","mailto:"+full_legislators_data[i].oc_email);
                    $("#leg_chamber").html(full_legislators_data[i].chamber);
                    $("#leg_phone").html("<a href=\"tel:"+full_legislators_data[i].phone+"\">"+full_legislators_data[i].phone+"</a>");
                    if(full_legislators_data[i].party=="R")
                    {
                        $("#leg_party_image").attr("src","Assets/images/r.png");
                        $("#leg_party").html("Republicans");
                    }
                    else if(full_legislators_data[i].party=="D")
                    {
                        $("#leg_party_image").attr("src","Assets/images/d.png");
                        $("#leg_party").html("Democrats");
                    }
                    else
                    {
                        $("#leg_party_image").attr("src","Assets/images/i.png");
                        $("#leg_party").html("Independent");
                    }
                    $("#leg_start_term").html(moment(full_legislators_data[i].term_start,"YYYY-MM-DD").format("MMM DD, YYYY"));
                    $("#leg_end_term").html(moment(full_legislators_data[i].term_end).format("MMM DD, YYYY"));
                    $("#leg_office").html(full_legislators_data[i].office);
                    $("#leg_progress").attr("aria-valuenow",Math.round(full_legislators_data[i].progress));
                    $("#leg_progress").html(Math.round(full_legislators_data[i].progress)+"%");
                    $("#leg_progress").css("width",Math.round(full_legislators_data[i].progress)+"%");
                    $("#leg_state").html(full_legislators_data[i].state_name);
                    $("#leg_fax").html("<a href=\"tel:"+full_legislators_data[i].fax+"\">"+full_legislators_data[i].fax+"</a>");
                    $("#leg_birthday").html(moment(full_legislators_data[i].birthday).format("MMM DD, YYYY"));
                    if(full_legislators_data[i].twitter_id!="")
                        $("#leg_twitter").attr("href","http://www.twitter.com/"+full_legislators_data[i].twitter_id);
                    if(full_legislators_data[i].facebook_id!="")
                        $("#leg_facebook").attr("href","http://www.fb.com/"+full_legislators_data[i].facebook_id);
                    if(full_legislators_data[i].website!="")
                        $("#leg_website").attr("href",full_legislators_data[i].website);
                    $http.get("index.php?op=legis_comm&bio_id="+bio_id).success(function(response){
                        $scope.legis_comms=response.results;
                        for(i=0;i<response.results.length;i++)
                        {
                            $("#legis_committees").append("<tr><td style=\"text-transform:capitalize;\">"+response.results[i].chamber+"</td><td style=\"text-transform:uppercase;\">"+response.results[i].committee_id+"</td><td class=\"hidden-xs\">"+response.results[i].name+"</td></tr>")
                        }
                    });
                    $http.get("index.php?op=legis_bills&bio_id="+bio_id).success(function(response){
                        $scope.legis_bills=response.results;
                        for(i=0;i<response.results.length;i++)
                        {
                            if(response.results[i].last_version.urls.pdf == null)
                            {
                                $("#legis_bills").append("<tr><td style=\"text-transform:uppercase;\">"+response.results[i].bill_id+"</td><td class=\"hidden-xs\">"+response.results[i].official_title+"</td><td style=\"text-transform:capitalize;\" class=\"hidden-xs\">"+response.results[i].chamber+"</td><td style=\"text-transform:capitalize\" class=\"hidden-xs\">"+response.results[i].bill_type+"</td><td class=\"hidden-xs\">"+response.results[i].congress+"</td><td>N/A</td></tr>");
                            }
                            else
                            {
                                $("#legis_bills").append("<tr><td style=\"text-transform:uppercase;\">"+response.results[i].bill_id+"</td><td class=\"hidden-xs\">"+response.results[i].official_title+"</td><td style=\"text-transform:capitalize;\" class=\"hidden-xs\">"+response.results[i].chamber+"</td><td style=\"text-transform:capitalize\" class=\"hidden-xs\">"+response.results[i].bill_type+"</td><td class=\"hidden-xs\">"+response.results[i].congress+"</td><td><a href=\""+response.results[i].last_version.urls.pdf+"\" >Link</a></td></tr>");
                            }
                        }
                    });
                }   
            }
            $("#Legislators_Carousel").carousel("next");
        });
};
});
var full_comm_house_data;
var full_comm_senate_data;
var full_comm_joint_data;
app.controller('comm_ctrl',function($scope,$http,$rootScope){
    $http.get("index.php?op=committees&category=house").success(function (response) {
        full_comm_house_data=response.results;
        for(k=0;k<full_comm_house_data.length;k++)
        {
            if(isFav(full_comm_house_data[k].committee_id,1))
            {
                full_comm_house_data[k].favorite="fa fa-star";
                full_comm_house_data[k].style="padding: 2px; color: rgb(230, 230, 71); font-size: 30px; ";
            }
            else
            {
                full_comm_house_data[k].favorite="fa fa-star-o";
                full_comm_house_data[k].style="padding: 2px; color: #ccc; font-size: 30px; ";
            }
        }
        $rootScope.comm_house_data=full_comm_house_data;
    });
    $http.get("index.php?op=committees&category=senate").success(function (response) {
        full_comm_senate_data=response.results;
        for(k=0;k<full_comm_senate_data.length;k++)
        {
            if(isFav(full_comm_senate_data[k].committee_id,1))
            {
                full_comm_senate_data[k].favorite="fa fa-star";
                full_comm_senate_data[k].style="padding: 2px; color: rgb(230, 230, 71); font-size: 30px; ";
            }
            else
            {
                full_comm_senate_data[k].favorite="fa fa-star-o";
                full_comm_senate_data[k].style="padding: 2px; color: #ccc; font-size: 30px; ";
            }
        }
        $rootScope.comm_senate_data=full_comm_senate_data;    
    });
    $http.get("index.php?op=committees&category=joint").success(function (response) {
        full_comm_joint_data=response.results;
        for(k=0;k<full_comm_joint_data.length;k++)
        {
            if(isFav(full_comm_joint_data[k].committee_id,1))
            {
                full_comm_joint_data[k].favorite="fa fa-star";
                full_comm_joint_data[k].style="padding: 2px; color: rgb(230, 230, 71); font-size: 30px; ";
            }
            else
            {
                full_comm_joint_data[k].favorite="fa fa-star-o";
                full_comm_joint_data[k].style="padding: 2px; color: #ccc; font-size: 30px; ";
            }
        }
        $scope.comm_joint_data=full_comm_joint_data;
    });

    $scope.cfc=function(committeeid,a)
    {
        var res;
        if(a==1)
        {
            for(i=0;i<full_comm_house_data.length;i++)
            {
                if(full_comm_house_data[i].committee_id==committeeid)
                {
                    res=full_comm_house_data[i];
                    break;
                }
            }
        }
        else if(a==2)
        {
            for(i=0;i<full_comm_senate_data.length;i++)
            {
                if(full_comm_senate_data[i].committee_id==committeeid)
                {
                    res=full_comm_senate_data[i];
                    break;
                }
            }
        }
        else
        {
            for(i=0;i<full_comm_joint_data.length;i++)
            {
                if(full_comm_joint_data[i].committee_id==committeeid)
                {
                    res=full_comm_joint_data[i];
                    break;
                }
            }
        }
        if($("#"+committeeid).attr("class")=="fa fa-star-o")
        {
            var json_comm=JSON.parse(localStorage.getItem("hw_comm"));
            if(localStorage.getItem("hw_comm")=="null"||localStorage.getItem("hw_comm")==null)
                json_comm=[res];
            else
                json_comm.push(res);
            localStorage.setItem("hw_comm",JSON.stringify(json_comm));
            $("#"+committeeid).attr("class","fa fa-star");
            $("#"+committeeid).css("color","rgb(230, 230, 71)")
        }
        else
        {
            var json_comm=JSON.parse(localStorage.getItem("hw_comm"));
            for(i=0;i<json_comm.length;i++)
            {
                if(json_comm[i].committee_id==committeeid)
                {
                    json_comm.splice(i,1);
                    break;
                }
            }
            localStorage.setItem("hw_comm",JSON.stringify(json_comm));
            $("#"+committeeid).attr("class","fa fa-star-o");
            $("#"+committeeid).css("color","#ccc");
        }
    }
});
app.controller('bills_ctrl',function($scope,$http){
    $scope.bvd=function(billid){
        if(isFav(billid,2))
        {
            $("#bills_fav_icon").attr("class","fa fa-star");
            $("#bills_fav_icon").css("color","rgb(230, 230, 71)");
        }
        else
        {
            $("#bills_fav_icon").attr("class","fa fa-star-o");
            $("#bills_fav_icon").css("color","#ccc");
        }
        flag=0;
        var res;
        if(flag==0)
        {
            for(i=0;i<full_bill_data_active.length;i++)
            {
                if(full_bill_data_active[i].bill_id==billid)
                {
                    flag=1;
                    res=full_bill_data_active[i];
                    break;
                }
            }
        }
        if(flag==0)
        {
            for(i=0;i<50;i++)
            {
                if(full_bill_data_old[i].bill_id==billid)
                {
                    flag=2;
                    res=full_bill_data_old[i];
                    break;
                }
            }
        }
        if(flag!=0)
        {
            $("#temp_bill_bill_id").html(res.bill_id);
            $("#bill_bill_id").html(res.bill_id);
            $("#bill_title").html(res.official_title);
            $("#bill_bill_type").html(res.bill_type);
            $("#bill_sponsor").html(res.sponsor.title+". "+res.sponsor.last_name+", "+res.sponsor.first_name);
            $("#bill_chamber").html(res.chamber);
            if(res.chamber=="senate")
                $("#bill_chamber_image").attr("src","Assets/images/s.png");
            else if(res.chamber=="house")
                $("#bill_chamber_image").attr("src","Assets/images/h.png");
            if(flag==1)
                $("#bill_status").html("Active");
            else
                $("#bill_status").html("New");
            $("#bill_introduced_on").html(res.introduced_on);
            $("#bill_congress_url").html("<a href=\""+res.urls.congress+"\" >Link</a>");
            $("#bill_version_status").html(res.last_version.version_name);
            $("#bill_bill_url").html("<a href=\""+res.last_version.urls.pdf+"\" >Link</a>");
            $("#bill_object_pdf").attr("data",res.last_version.urls.pdf);
            $("#Bills_Carousel").carousel("next");
        }
    };
    $http.get("index.php?op=bills&category=active").success(function (response) {
        $scope.bill_active_data=response.results;
        full_bill_data_active=response.results;
    });
    $http.get("index.php?op=bills&category=old").success(function (response) {
        $scope.bill_old_data=response.results;
        full_bill_data_old=response.results;
    });
});
app.controller('fav_ctrl',function($rootScope,$scope,$http,$timeout){
    var fav_legs=JSON.parse(localStorage.getItem("hw_leg"));
    var fav_comm=JSON.parse(localStorage.getItem("hw_comm"));
    var fav_bill=JSON.parse(localStorage.getItem("hw_bill"));
    $rootScope.fav_legs_data=JSON.parse(localStorage.getItem("hw_leg"));
    $rootScope.fav_comm_data=JSON.parse(localStorage.getItem("hw_comm"));
    $rootScope.fav_bill_data=JSON.parse(localStorage.getItem("hw_bill"));
    $scope.update=function(){
        $timeout(function() {
            $scope.$apply(function() {
                $rootScope.fav_legs_data=JSON.parse(localStorage.getItem("hw_leg"));
                $rootScope.fav_comm_data=JSON.parse(localStorage.getItem("hw_comm"));
                $rootScope.fav_bill_data=JSON.parse(localStorage.getItem("hw_bill"));
                fav_legs=JSON.parse(localStorage.getItem("hw_leg"));
                fav_comm=JSON.parse(localStorage.getItem("hw_comm"));
                fav_bill=JSON.parse(localStorage.getItem("hw_bill"));
            });
        }, 0, false);
    }
    $scope.dell=function(bioid){
        var index;
        fav_legs=$rootScope.fav_legs_data;
        for(i=0;i<fav_legs.length;i++)
        {
            if(fav_legs[i].bioguide_id==bioid)
            {
                index=i;
                break;
            }
        }
        fav_legs.splice(index,1);
        $rootScope.fav_legs_data=fav_legs;
        localStorage.setItem("hw_leg",JSON.stringify(fav_legs));
    }
    $scope.delc=function(committeeid){
        var index;
        var ff=0;
        fav_comm=$rootScope.fav_comm_data;
        for(i=0;i<fav_comm.length;i++)
        {
            if(fav_comm[i].committee_id==committeeid)
            {
                if(fav_comm[i].chamber=="house")
                    ff=0;
                else if(fav_comm[i].chamber=="senate")
                    ff=1;
                else
                    ff=2;
                index=i;
                break;
            }
        }
        fav_comm.splice(index,1);
        $rootScope.fav_comm_data=fav_comm;
        localStorage.setItem("hw_comm",JSON.stringify(fav_comm));
        if(ff==0)
            var tee=$rootScope.comm_house_data;
        else if(ff==1)
            var tee=$rootScope.comm_senate_data;
        else
            var tee=$rootScope.comm_joint_data;
        for(ii=0;ii<tee.length;ii++)
        {
            if(tee[ii].committee_id==committeeid)
            {
                alert (' i found one ');
                tee[ii].favorite="fa fa-star-o";
                tee[ii].style="padding: 2px; color: #ccc; font-size: 30px; ";
                break;
            }
        }
        if(ff==0)
             $rootScope.comm_house_data = tee;
        else if(ff==1)
            $rootScope.comm_senate_data = tee;
        else
            $rootScope.comm_joint_data = tee;
    }
    $scope.delb=function(billid){
        var index;
        $("#bill_fav_button").css("color","pink");
        fav_bill=$rootScope.fav_bill_data;
        for(i=0;i<fav_bill.length;i++)
        {
            if(fav_bill[i].bill_id==billid)
            {
                index=i;
                break;
            }
        }
        fav_bill.splice(index,1);
        $rootScope.fav_bill_data=fav_bill;
        localStorage.setItem("hw_bill",JSON.stringify(fav_bill));
    }
    $scope.fvdl=function(bio_id){
        $http.get("index.php?op=legis_comm&bio_id="+bio_id).success(function(){
            for(i=0;i<full_legislators_data.length;i++)
            {
                if(bio_id==full_legislators_data[i].bioguide_id)
                {
                    $("#fleg_image").attr("src","https://theunitedstates.io/images/congress/original/"+full_legislators_data[i].bioguide_id+".jpg");
                    $("#fleg_name").html(full_legislators_data[i].title+". "+full_legislators_data[i].last_name+", "+full_legislators_data[i].first_name);
                    $("#fleg_mail").html(full_legislators_data[i].oc_email);
                    $("#fleg_mail").attr("href","mailto:"+full_legislators_data[i].oc_email);
                    $("#fleg_chamber").html(full_legislators_data[i].chamber);
                    $("#fleg_phone").html("<a href=\"tel:"+full_legislators_data[i].phone+"\" >"+full_legislators_data[i].phone+"</a>");
                    if(full_legislators_data[i].party=="R")
                    {
                        $("#fleg_party_image").attr("src","Assets/images/r.png");
                        $("#fleg_party").html("Republicans");
                    }
                    else if(full_legislators_data[i].party=="D")
                    {
                        $("#fleg_party_image").attr("src","Assets/images/d.png");
                        $("#fleg_party").html("Democrats");
                    }
                    else
                    {
                        $("#fleg_party_image").attr("src","Assets/images/i.png");
                        $("#fleg_party").html("Independent");
                    }
                    $("#fleg_start_term").html(moment(full_legislators_data[i].term_start,"YYYY-MM-DD").format("MMM DD, YYYY"));
                    $("#fleg_end_term").html(moment(full_legislators_data[i].term_end).format("MMM DD, YYYY"));
                    $("#fleg_office").html(full_legislators_data[i].office);
                    $("#fleg_progress").attr("aria-valuenow",Math.round(full_legislators_data[i].progress));
                    $("#fleg_progress").html(Math.round(full_legislators_data[i].progress)+"%");
                    $("#fleg_progress").css("width",Math.round(full_legislators_data[i].progress)+"%");
                    $("#fleg_state").html(full_legislators_data[i].state_name);
                    $("#fleg_fax").html("<a href=\"tel:"+full_legislators_data[i].fax+"\">"+full_legislators_data[i].fax+"</a>");
                    $("#fleg_birthday").html(moment(full_legislators_data[i].birthday).format("MMM DD, YYYY"));
                    if(full_legislators_data[i].twitter_id!="")
                        $("#fleg_twitter").attr("href","http://www.twitter.com/"+full_legislators_data[i].twitter_id);
                    if(full_legislators_data[i].facebook_id!="")
                        $("#fleg_facebook").attr("href","http://www.fb.com/"+full_legislators_data[i].facebook_id);
                    if(full_legislators_data[i].website!="")
                        $("#fleg_website").attr("href",full_legislators_data[i].website);
                    $http.get("index.php?op=legis_comm&bio_id="+bio_id).success(function(response){
                        $scope.legis_comms=response.results;
                        for(i=0;i<5;i++)
                        {
                            $("#flegis_committees").append("<tr><td style=\"text-transform:capitalize;\">"+response.results[i].chamber+"</td><td style=\"text-transform:uppercase;\">"+response.results[i].committee_id+"</td><td class=\"hidden-xs\">"+response.results[i].name+"</td></tr>")
                        }
                    });
                    $http.get("index.php?op=legis_bills&bio_id="+bio_id).success(function(response){
                        $scope.legis_bills=response.results;
                        for(i=0;i<response.results.length;i++)
                        {
                            if(response.results[i].last_version.urls.pdf == null)
                            {
                                $("#flegis_bills").append("<tr><td style=\"text-transform:uppercase;\">"+response.results[i].bill_id+"</td><td class=\"hidden-xs\">"+response.results[i].official_title+"</td><td style=\"text-transform:capitalize;\" class=\"hidden-xs\">"+response.results[i].chamber+"</td><td style=\"text-transform:capitalize\">"+response.results[i].bill_type+"</td><td class=\"hidden-xs\">"+response.results[i].congress+"</td><td>N/A</td></tr>");
                            }
                            else
                            {
                                $("#flegis_bills").append("<tr><td style=\"text-transform:uppercase;\">"+response.results[i].bill_id+"</td><td class=\"hidden-xs\">"+response.results[i].official_title+"</td><td style=\"text-transform:capitalize;\" class=\"hidden-xs\">"+response.results[i].chamber+"</td><td style=\"text-transform:capitalize\">"+response.results[i].bill_type+"</td><td class=\"hidden-xs\">"+response.results[i].congress+"</td><td><a href=\""+response.results[i].last_version.urls.pdf+"\" >Link</a></td></tr>");
                            }
                        }
                    });
                }   
            }
            $("#Favorites_Carousel").carousel(1);
        });
}
$scope.fvdb=function(billid){
    flag=0;
    var res;
    if(flag==0)
    {
        for(i=0;i<full_bill_data_active.length;i++)
        {
            if(full_bill_data_active[i].bill_id==billid)
            {
                flag=1;
                res=full_bill_data_active[i];
                break;
            }
        }
    }
    if(flag==0)
    {
        for(i=0;i<50;i++)
        {
            if(full_bill_data_old[i].bill_id==billid)
            {
                flag=2;
                res=full_bill_data_old[i];
                break;
            }
        }
    }
    if(flag!=0)
    {
        $("#fbill_bill_id").html(res.bill_id);
        $("#fbill_title").html(res.official_title);
        $("#fbill_bill_type").html(res.bill_type);
        $("#fbill_sponsor").html(res.sponsor.title+". "+res.sponsor.last_name+", "+res.sponsor.first_name);
        $("#fbill_chamber").html(res.chamber);
        if(res.chamber=="senate")
            $("#fbill_chamber_image").attr("src","Assets/images/s.png");
        else if(res.chamber=="house")
            $("#fbill_chamber_image").attr("src","Assets/images/h.png");
        if(flag==1)
            $("#fbill_status").html("Active");
        else
            $("#fbill_status").html("New");
        $("#fbill_introduced_on").html(res.introduced_on);
        $("#fbill_congress_url").html("<a href=\""+res.urls.congress+"\" >Link</a>");
        $("#fbill_version_status").html(res.last_version.version_name);
        $("#fbill_bill_url").html("<a href=\""+res.last_version.urls.pdf+"\" >Link</a>");
        $("#fbill_object_pdf").attr("data",res.last_version.urls.pdf);
        $("#Favorites_Carousel").carousel(2);
    }
};
});
function isFav(id,ch)
{
    if(ch==0)
    {
        if(localStorage.getItem("hw_leg")==null||localStorage.getItem("hw_leg")=="null")
            return false;
        var json_leg=JSON.parse(localStorage.getItem("hw_leg"));

        for(i=0;i<json_leg.length;i++)
        {
           if(json_leg[i].bioguide_id==id)
                return true;
        }
        return false;
    }
    else if(ch==1)
    {
        if(localStorage.getItem("hw_comm")==null||localStorage.getItem("hw_comm")=="null")
            return false;
        var json_comm=JSON.parse(localStorage.getItem("hw_comm"));
        for(i=0;i<json_comm.length;i++)
            if(json_comm[i].committee_id==id)
                return true;
            return false;
    }
    else if(ch==2)
    {
        if(localStorage.getItem("hw_bill")==null||localStorage.getItem("hw_bill")=="null")
            return false;
        var json_bill=JSON.parse(localStorage.getItem("hw_bill"));
        for(i=0;i<json_bill.length;i++)
            if(json_bill[i].bill_id==id)
                return true;
            return false;
        }
    }