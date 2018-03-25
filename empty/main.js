function GET(url){
	return rest.call(url);
}

function onUserSyncMessage(senderDeviceId,data){

	var url="http://api.openweathermap.org/data/2.5/forecast?id=3094802&APPID=a23200bf64e90788b98d635f75be89af&units=metric";


	var response = JSON.parse(GET(url));


	var remoteMeData = new RemoteMeData(4*6);
	var now = new Date();

	var len=0;
	for( i=0;i<response.list.length;i++){
		var date = new Date(response.list[i].dt*1000 );
		if (( date.getHours()==12)&&(len<4)){
			day=  date.getDate();
			month=   date.getMonth()+1;
			temp=Math.round(response.list[i].main.temp);
			icon=parseInt(response.list[i].weather[0].icon.substring(0,2));
			len++;
			print(day+" "+month+" "+temp+" "+icon);




			remoteMeData.putInt8(now.getDate()==day?1:0);

			remoteMeData.putInt8(date.getDay());
			remoteMeData.putInt8(day);
			remoteMeData.putInt8(month);
			remoteMeData.putInt8(temp);
			remoteMeData.putInt8(icon);
		}

	}



	return new Int8Array(remoteMeData.getBufferArray());


}


function onUserMessage(senderDeviceId,data){
	onUserSyncMessage(senderDeviceId,data);
//
}