var idx =0;
function dayComma(day){
   if(day == "" || day.length != 8){
   		return "";
   }
   return  day.substring(0,4)+"."+day.substring(4,6)+"."+day.substring(6,8);
}

function sumComma(inputVal){
		var chk		= 0;				// chk 는 천단위로 나눌 길이를 check
		var share	= 0;				// share 200,000 와 같이 3의 배수일 때를 구분하기 위한 변수
		var start	= 0;
		var triple	= 0;				// triple 3, 6, 9 등 3의 배수 
		var end		= 0;				// start, end substring 범위를 위한 변수  
		var total	= "";			
		var input	= "";				// total 임의로 string 들을 규합하기 위한 변수
		if (inputVal.length > 3){
			input = delCom(inputVal, inputVal.length);

			chk = (input.length)/3;					// input 값을 3의로 나눈 값 계산
			chk = Math.floor(chk);					// 그 값보다 작거나 같은 값 중 최대의 정수 계산
			share = (input.length)%3;				// 200,000 와 같은 3의 배수인 수를 걸러내기 위해 나머지 계산
			if (share == 0 ) {						
				chk = chk - 1;					// 길이가 3의 배수인 수를 위해 chk 값을 하나 뺀다.
			}
			for(i=chk; i>0; i--){
				triple = i * 3;					// 3의 배수 계산 9,6,3 등과 같은 순으로
				end = Number(input.length)-Number(triple);	// 이 때의 end 값은 점차 늘어 나게 된다.
				total += input.substring(start,end)+",";	// total은 앞에서 부터 차례로 붙인다.
				start = end;					// end 값은 다음번의 start 값으로 들어간다.
			}
			total +=input.substring(start,input.length);		// 최종적으로 마지막 3자리 수를 뒤에 붙힌다.
		} else {
			total = inputVal;					// 3의 배수가 되기 이전에는 값이 그대로 유지된다.
		}
		return total;
}

function dateChk(){
	var main = document.form1;

	var syear = main.syear.value;
	var smon  = main.smon.value;
	var sday  = main.sday.value;

	var eyear = main.eyear.value;
	var emon  = main.emon.value; 
	var eday  = main.eday.value;

	var revalue1 = fn_isYearMonthDay(syear, smon, sday);

	//입사일자 유효성 체크
	if(main.syear.value =='' || main.syear.value =='0' ||revalue1 == 1 ){
		alert("입사년도가 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.syear.focus();
		return false;
	}
	
	if(main.smon.value =='' || main.smon.value =='0' || revalue1 == 2){
		alert("입사월이 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.smon.focus();
		return false;
	}
	 
	if(main.sday.value =='' || main.sday.value =='0' || revalue1 == 3){
		alert("입사일이 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.sday.focus();
		return false;
	}

	var revalue2 = fn_isYearMonthDay(eyear, emon, eday);
	//퇴사일자 유효성 체크
	if(main.eyear.value =='' || main.eyear.value =='0' || revalue2 == 1){
		alert("퇴사년도가 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.eyear.focus();
		return false;
	}
	
	if(main.emon.value =='' || main.emon.value =='0' || revalue2 == 2){
		alert("퇴사월이 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.emon.focus();
		return false;
	}
	
	if(main.eday.value =='' || main.eday.value =='0' || revalue2 == 3){
		alert("퇴사일이 적합하지 않습니다. 바르게 입력해 주십시오.");
		main.eday.focus();
		return false;
	}
	
	var symd1 = syear+fn_setFillzeroByVal(smon,2)+fn_setFillzeroByVal(sday,2);
	var eymd2 = eyear+fn_setFillzeroByVal(emon,2)+fn_setFillzeroByVal(eday,2);	
	
	symd1 = ( new Function('return '+ symd1 ))();
	eymd2 = ( new Function('return '+ eymd2 ))();

	if(symd1 >= eymd2 ){
		alert("퇴사일이 입사일 이전 입니다. 바르게 입력해 주십시오.");
		main.syear.focus();
		return false;
	}

	return true;
}

// 평균 임금 계산 기간 보기 버튼 클릭 함수
function setDate(){
	var main = document.form1;

	//입사 퇴사 일자체크
	if(!dateChk()) return;

	var syear = main.syear.value;
	var smon  = main.smon.value;
	var sday  = main.sday.value;

	var eyear = main.eyear.value;
	var emon  = main.emon.value;
	var eday  = main.eday.value;

	var sdate1 = main.syear.value+'/'+main.smon.value+'/'+main.sday.value;
	var edate1 = main.eyear.value+'/'+main.emon.value+'/'+main.eday.value;

	//재직일수 구하기

	var sDate = new Date(sdate1);
	var eDate = new Date(edate1);
	
    var addYear = new Date(edate1);	
    var eDateBeforeDay =  new Date(edate1);
    eDateBeforeDay = new Date(eDateBeforeDay.setDate(eDateBeforeDay.getDate()-1));
    var month_3_before = new Date(edate1);	
	var termDays = Math.ceil((eDate-sDate)/1000/60/60/24);    //오늘날짜와 특정 날짜의 차를 구한다
	
    //퇴직일 1년전 날짜구하기 
    addYear = new Date(addYear.setFullYear(addYear.getFullYear()-1));

    if(sDate > addYear){
 		alert("재직기간은 1년이상 이여야합니다");
		return false;    
    }  
     
	main.termDays.value = termDays;
    month_3_before = new Date(month_3_before.setMonth(month_3_before.getMonth()-3));
    
    //3개월 평균 구하기
    //미산입기간 체크
	const trLength = $('tr[id^="ncv_"]').length + 1; 

	//#### 미산입기간 배열입력
	var ncObj = [];
	for (let i = 1; i < trLength; i++) {
		let sDt = $('#ncvs_'+i).html();
		let eDt = $('#ncve_'+i).html();
		
		sDt = sDt.replace(/\./g, '');
		eDt = eDt.replace(/\./g, '');
        ncObj[i-1] = sDt+''+eDt;		

	}
	//####내림차순으로 정렬
	ncObj.sort(function compare(a,b){
		return a == b ? 0 : a > b ? -1 : 1 ;
	});
	
	
	let endDay;
	let fristDay;
	
	
	let fristDay1;
	let endDay2;
	
	let ncvCheck = false;//미산입기간 퇴직전 3개월 초과
	let bContinue = true ; 
	
	let check_i_val=0;//미산입기간 3개월 체크시 체크된 idx 값 체크
	//####미산입기간이 퇴직전 3개월을 초과하는지 체크		
	for (let i = 0; i < ncObj.length; i++) {
		if(i > 0){		
			endDay2 = new Date(dayComma(ncObj[i].substring(8,16)));
			endDay2 = new Date(endDay2.setDate(endDay2.getDate()+1));
		
			if(fristDay1.getTime() != endDay2.getTime()){
				bContinue = false; //미산입기간 일이 연속으로 입력되었는지 체크
				check_i_val = i ;
				break;
			}
			fristDay = new Date(dayComma(ncObj[i].substring(0,8)));
		}else{
			fristDay = new Date(dayComma(ncObj[i].substring(0,8)));		
			endDay = new Date(dayComma(ncObj[i].substring(8,16)));			
		}
		fristDay1 = new Date(dayComma(ncObj[i].substring(0,8)));
	}
	
    //end
    if(ncObj.length > 0){     
	    //미산입기간이 퇴직전 3개월을 초과하는경우 미산입기간 초일 직전일부터 3개월을 평균임금산정기간으로 설정    
	    if((month_3_before.getTime() > fristDay.getTime()) && (endDay.getTime() >= eDateBeforeDay.getTime())  ){
			eyear = fristDay.getFullYear();
			emon  = fristDay.getMonth()+1;
			eday  = fristDay.getDate();
			edate1 = eyear+'/'+emon+'/'+eday;
			eDate = new Date(edate1);
			ncvCheck = true;		
	    }        
	}
	var maxDay = fn_MaxdayYearMonth(eyear, emon); 

	var yy;
	var mm;  
	var dd;
	var dd2;
	var cntday = 0;
	var fymd;
	var tymd;  
	var sumday = 0;
	var sumbasic = 0;
	var sumbonus = 0;
	

	if(( new Function('return '+ eday + '-1' ))() == 0){   //1일이라면
		emon = emon -1;
		//eday = fn_MaxdayYearMonth(eyear, emon);   //전달 말일
		idx = 3;
		main.index_value.value = "3";
	}else if(( new Function('return '+ eday + '-1' ))() > 0){	// 5.31, 5.30
		idx = 4;	
		main.index_value.value = "4";
	}    

	// 5.29, 5.30, 5.31 일 경우 2월 계산을 하지 않키위해서. 윤년일때는 5.29일 허용
	if( (emon+eday == '529' && !fn_isLeafYear(eyear)) || emon+eday == '530' || emon+eday == '531'){
		idx = 3;
		main.index_value.value = "3";
	}

	if(idx == 3){
		main.basic4.value = "0";
		main.bonus4.value = "0";
		main.basic4.disabled	= true;
		main.bonus4.disabled	= true;
		main.basic4.className	= "noinput";
		main.bonus4.className	= "noinput";
	}else if(idx ==4){
		//main.basic4.value = "0";
		//main.bonus4.value = "0";
		main.basic4.disabled	= false;
		main.bonus4.disabled	= false;
		main.basic4.className	= "textfield";
		main.bonus4.className	= "textfield";
	}

	for(i=1; i<idx+1 ; i++){

		//년월 계산
		if(( new Function('return '+ emon +'-'+ idx +'+'+ i ))() <= 0){
			yy = ( new Function('return '+ eyear + '-1' ))();
			mm =  12 + ( new Function('return '+ emon +'-'+ idx +'+'+ i ))();
			
		}else{
			yy = eyear ;
			mm = ( new Function('return '+ emon +'-'+ idx ))() + i;              
		}
		
		//일자 계산
		if(idx == 3){
			if( ((emon+eday == '529' && !fn_isLeafYear(eyear)) || emon+eday == '530' || emon+eday == '531') && i == 3){
				dd = 1;
				dd2 = ( new Function('return '+ eday + '-1' ))();
			} else {
				dd  = 1;
				dd2 = fn_MaxdayYearMonth(yy,mm);
			}
		}else if(idx ==4){
			if(i ==1){      
				
				if(( new Function('return '+ eday ))() > ( new Function('return '+ fn_MaxdayYearMonth(yy,mm) ))()){
					dd = fn_MaxdayYearMonth(yy,mm) - ( new Function('return '+ fn_MaxdayYearMonth(eyear,emon) +'-'+ eday ))();				
				}else{
					dd = ( new Function('return '+ eday ))();
				}
				dd2 = fn_MaxdayYearMonth(yy,mm);
			}else if(i ==2 || i ==3){
				dd = 1;
				dd2 = fn_MaxdayYearMonth(yy,mm);
			}else if(i ==4){
				dd = 1;
				dd2 = ( new Function('return '+ eday + '-1' ))();
			}
		}    

		//날짜 관련 화면셋팅
		fymd = yy+"."+mm+"."+dd;
		
		if(dd2 != 0 && dd != dd2) {
			tymd = "~ "+yy+"."+mm+"."+dd2;
			var s = new Date(yy, mm,dd);     
			var e = new Date(yy, mm,dd2);  
			cntday = Math.ceil((e-s)/24/60/60/1000) +1;
		}else{
			tymd = "";            
			cntday = 1;
		}
		
		if(idx ==3 && i ==3){
			main.elements['fymd4'].value = "";
			main.elements['tymd4'].value = "";
			main.elements['cntday4'].value = "";               
		}
		
		
		
		sumday = ( new Function('return '+ sumday + '+' + cntday))();          

		main.elements['fymd'+i].value = fymd;
		main.elements['tymd'+i].value = tymd;
		main.elements['cntday'+i].value = cntday;

		//월별일수
		main.elements['sumday'].value = sumday;
		main.elements['totalDay'].value = sumday;  		                    
	} 
	
	//기간이 바뀌면 기간별 금액도 바뀐다.
	//main.sumbasic.value = 0;
    //main.sumbonus.value = 0;
	main.control.value = "1";
	
	
	//if(ncvCheck){//미산입기간 퇴직건 3개월 초과 상태
	
	//}else{//미산입기간 기간별 일자 제외
	
		// 미산입기간이 퇴직전 3개월 평균임금과 겹치는 기간을 평균임금산정기간에서 제외시켜야 함(기간별일수만 제외하여 표시) 

		var thrMnLength = $('tr[id^="thrMn"]').length;
		//$('tr[id^="thrMn"]').each(function(ids) {
		
		for(ids = 0 ; ids < thrMnLength ; ids++){
			let sRmDt = $('input[name="fymd' + (ids + 1) + '"]').val() || '0';
			let eRmDt = $('input[name="tymd' + (ids + 1) + '"]').val() || '0';
			eRmDt = eRmDt.replace(/[\s~\s]/g, '');
			
			if (sRmDt != '0' && eRmDt != '0') {
				const sRmDtArr = sRmDt.split('.');
				const eRmDtArr = eRmDt.split('.');
				let sRmDtr = sRmDtArr[0];

				sRmDtr += (Number(sRmDtArr[1]) < 10) ? '0' + Number(sRmDtArr[1]) : sRmDtArr[1];
				sRmDtr += (Number(sRmDtArr[2]) < 10) ? '0' + Number(sRmDtArr[2]) : sRmDtArr[2];
				
				let eRmDtr = eRmDtArr[0];
				eRmDtr += (Number(eRmDtArr[1]) < 10) ? '0' + Number(eRmDtArr[1]) : eRmDtArr[1];
				eRmDtr += (Number(eRmDtArr[2]) < 10) ? '0' + Number(eRmDtArr[2]) : eRmDtArr[2];
				
				//$('tr[id^="ncv_"]').each(function(idx) {
				var ncvLength = $('tr[id^="ncv_"]').length;
				for(idx = 0 ; idx < ncvLength ; idx++){
					let ncSdt = $('#ncvs_' + (idx + 1)).text();
					let ncEdt = $('#ncve_' + (idx + 1)).text();
					
					let reNcSdt = ncSdt.replace(/\./g, '');
					let reNcEdt = ncEdt.replace(/\./g, '');
					
					// 퇴직전 3개월 기간에서 퇴직시작월일 < 미산입시작월일 < 퇴직종료월일 && 퇴직시작월일 < 미산입종료월일 < 퇴직종료월일
					//sRmDtr  eRmDtr  퇴직일자
					//reNcSdt  reNcEdt  미산입기간
					//if ((Number(sRmDtr) <= Number(reNcSdt) && Number(eRmDtr) > Number(reNcSdt)) && (Number(sRmDtr) < Number(reNcEdt) && Number(eRmDtr) > Number(reNcSdt))) {

					if(    !((Number(sRmDtr) > Number(reNcSdt) &&  Number(sRmDtr) > Number(reNcEdt)) ||   (Number(eRmDtr) < Number(reNcSdt) &&  Number(eRmDtr) < Number(reNcEdt)))    ){					
                        let ncS;
                        let ncE;
						//겹치는날짜 계산
						if(Number(sRmDtr.substring(0,6)) == Number(reNcSdt.substring(0,6))){//시작일 동일월 일경우
							if(idx == 0){
								ncS = fn_getDayDash(sRmDtr);//미산입기간 일 대입
							}else{
								ncS = fn_getDayDash(reNcSdt);//미산입기간 일 대입							
							}
						}else{
						    ncS = fn_getDayDash(sRmDtr);//퇴직전 3개월  대입
						}
						if(Number(eRmDtr.substring(0,6)) == Number(reNcEdt.substring(0,6))){//종료일 동일월 일경우
							ncE = fn_getDayDash(reNcEdt);//미산입기간 일 대입
						}else{
							ncE = fn_getDayDash(eRmDtr);//퇴직전 3개월  대입					
						}						
					
						const dateS = new Date(ncS);
					 	const dateE = new Date(ncE);
					 	
					 	const dateSTime = dateS.getTime();
					 	const dateETime = dateE.getTime();
					 	// 미산입기간일수
					 	let diffDays = dateETime - dateSTime;
					 	diffDays = (diffDays / (1000 * 60 * 60 * 24))+1;
					 	
					 	
					 	// 기간별 일수를 변경한다.
					 	let cntday = $('input[name="cntday' + (ids + 1) + '"]').val();
					 	$('input[name="cntday' + (ids + 1) + '"]').val(Number(cntday) - Number(diffDays));
					 	let sumday = main.sumday.value;
					 	main.sumday.value = Number(sumday) - Number(diffDays);					 	
					}
				}
			}
		}	
	//}
	
	//근무제외기간 계산하기	
	checkRule1();

}	
function setBasicSum(obj){
	var main = document.form1;

	if(main.control.value != "1"){
		obj.value = "0";
		alert("'평균임금계산 기간보기' 버튼을 눌러 주십시오");
		return;
	}
	let sum=0;
	for(var i=1 ; i <5 ; i++){
		let sum1 = $('#basic'+i).val().replace(/,/g, '');	
		sum = Number(sum) + Number(sum1);
	}
	
	$('#basicSum').val(sumComma(sum+""));

  
}

function setBonusSum(obj){   
   
	var main = document.form1;

	if(main.control.value != "1"){
		obj.value = "0";
		alert("'평균임금계산 기간보기' 버튼을 눌러 주십시오");
		return;
	}

	let sum=0;
	for(var i=1 ; i <5 ; i++){
		let sum1 = $('#bonus'+i).val().replace(/,/g, '');	
		sum = Number(sum) + Number(sum1);
	}
	
	$('#etcSum').val(sumComma(sum+""));

}

// 평균 임금 계산 버튼 클릭 함수
function avrPayCal(){

	var main = document.form1;
    //입사 퇴사 일자체크
	if(!dateChk()) return;
	
	//평균임금계산 체크
	if(main.control.value != "1"){
		alert("'평균임금계산 기간보기' 버튼을 눌러 주십시오");
		return;
	}

    var avrPay = 0;
    var totalPay = 0;
	var rounding = 0;
    var annualBonus = 0;
    var vacaBunus = 0;
    //기본급 합계
    var sumbasic = ( new Function('return '+ delCom(main.sumbasic.value, main.sumbasic.value.length * 1) ))();
    //기타수당합계
    var sumbonus = ( new Function('return '+ delCom(main.sumbonus.value, main.sumbonus.value.length * 1) ))();

	if(main.sumbasic.value == "" || main.sumbasic.value == "0")	sumbasic =0;
	if(main.sumbonus.value == "" || main.sumbonus.value == "0")	sumbonus =0;
    let totalDay = $('#totalDay').val();  
    let sumday   =  $('#sumday').val();  
	if(totalDay != sumday){//미산입기간이 있는경우
		let totalDay = $('#totalDay').val();//3개월 총일수
		let sumday = $('#sumday').val();//기간별 일수
	    //상여금 계산
	    annualBonus = ( new Function('return '+ delCom(main.annualBonus.value,main.annualBonus.value.length) * 0.25 * Number(sumday) / Number(totalDay)))();
	    //연차수당
	    vacaBunus = ( new Function('return '+ delCom(main.vacaBunus.value, main.vacaBunus.value.length) * 0.25 * Number(sumday) / Number(totalDay)))();	
	
	}else{
	    //상여금 계산
	    annualBonus = ( new Function('return '+ delCom(main.annualBonus.value,main.annualBonus.value.length) * 0.25 ))();
	    //연차수당
	    vacaBunus = ( new Function('return '+ delCom(main.vacaBunus.value, main.vacaBunus.value.length) * 0.25 ))();	
	}
	

    //임금총액
	$('#totalBunus').val(sumComma(sumbasic+sumbonus+Math.round(annualBonus+vacaBunus)+""));

    //총합
    totalPay = ( new Function('return '+ sumbasic +'+'+ sumbonus +'+'+ annualBonus +'+'+ vacaBunus ))();
    
    //임금총합이 0일때
	if(main.avrPay.value == "" && totalPay == 0 ){
		alert("임금총합이 0 입니다. 임금을 입력해 주십시오.");
		return;
	}

    //소수 셋째 자리에서 반올림
	//rounding = myRound(( new Function('return '+ totalPay /main.sumday.value))(),2)+"";
	
	//셋째자리에서 올림
	rounding = myCeil(( new Function('return '+ totalPay /main.sumday.value))(),2)+"";
	
	//금액 포멧만들어주기
	if(rounding.indexOf(".") == -1){
	}else{
		var k = rounding.lastIndexOf(".");
		var comFormat = checkThousand(rounding.substring(0, k), '0', 'N'); ;		
		rounding = comFormat + rounding.substring(k, rounding.length)
	}
	//1일 평균임금. 
    main.avrPay.value = rounding;
	
	//퇴직금은 ""로 셋팅
	main.retirePay.value= "";
}

// 퇴직금 계산 버튼 클릭 함수
function calRet(){
    var main = document.form1;
	//입사 퇴사 일자체크
	if(!dateChk()) return;

    var retPay = 0;
	var rounding ;
	var comPay = delCom(main.comPay.value, main.comPay.value.length);
	var avrPay = delCom(main.avrPay.value, main.avrPay.value.length);
	var calPay = delCom(main.avrPay.value, main.avrPay.value.length);	//기본은 평균값으로 

    //평균임금이 입력되어 있는 지 계산
	if(main.avrPay.value =="" || main.avrPay.value =="0"){
		alert("1일 평균임금이 없습니다. '평균임금계산' 버튼을 눌러 계산하시거나 직접 입력해 주십시오");
		return;
	}

	//평균임금계산 체크
	if(main.control.value != "1"){
		alert("'평균임금계산 기간보기' 버튼을 눌러 주십시오");
		return;
	}

	//통상임금이 일일평균임금보다 클경우 통상임금이 일일평균임금임.
	if(main.comPay.value != "" && main.comPay.value != "0"){
		if(parseFloat(avrPay) < parseFloat(comPay)){
			calPay = comPay;
		}
	}
	
	let cntSum = 0;
	$('input[name^="cntday"]').each(function(idx) {
		const cdy = $(this).val() || '';
		if (cdy != '' || cdy != 'null' || cdy != 'undefined') {
			cntSum += Number(cdy);
		}
	});
	
	$('#sumday').val(cntSum);
	
 
	//평균임금 소수점 제외계산을 소수점 포함하여 계산

	let reCalcSal = calPay * 30 * main.termDays.value/365; 
	//소수 셋째 자리에서 반올림
	//rounding = myRound(retirePay, 2) + "";
	//rounding = myRound(reCalcSal, 2);
	reCalcSal = Math.round(reCalcSal);
	reCalcSal = Math.floor(reCalcSal);
	
	rounding = reCalcSal.toString();
	
	//금액 포멧만들어주기
	if(rounding.indexOf(".") == -1){
		rounding =checkThousand(rounding, '0','N');
	}else{
		var k = rounding.lastIndexOf(".");
		var comFormat = checkThousand(rounding.substring(0, k), '0','N');
		rounding = comFormat + rounding.substring(k, rounding.length);
	}

    main.retirePay.value= rounding;
}

// 임금 초기화 버튼 클릭 함수    
function payreset(){
	var main = document.form1;

	main.basic1.value = "0";
	main.basic2.value = "0";
	main.basic3.value = "0";
	main.basic4.value = "0";
	main.bonus1.value = "0";
	main.bonus2.value = "0";
	main.bonus3.value = "0";
	main.bonus4.value = "0";
	main.sumbasic.value = "";
	main.sumbonus.value = "";

}

function setCurrYear(){
	var main = document.form1;
	for(m =0; m<main.syear.options.length; m++){
		if(main.syear.options[m].value == fn_getDateNowYear()){
			main.syear.options[m].selected =true ;
		}
	}

	for(n =0; n<main.eyear.options.length; n++){
		if(main.eyear.options[n].value == fn_getDateNowYear()){
			main.eyear.options[n].selected =true ;
		}
	}
}

function view_excel(){
	var main = document.form1;
	
	if(main.retirePay.value == "" ){
		alert("퇴직금 계산을 해주십시오.");
		return;
	}
	
	//top.location.href = "view_excel.jsp?fymd1="+main.fymd1.value;

	main.target="_top";
	main.action="retirementpayCalExcel.do";
	main.submit();
}



/** 
 * 연간상여금 및 연차수당을 넣었을 때  미산입기간을 입력하지 않았다면 입력한 금액의 12분의 3을 산입, 
 * 미산입기간을 입력하였다면 괄호값(입력한 금액 * 3/12 * 기간별일수 / 기간일수)로 계산
 */
function checkRule2() {
	console.log('미산입기간을 입력했을때 적용해야함');
}


 
 /**
  * 근무제외기간은 입력한 일수만큼 재직일수에서 제외하고 상단 재직일수에 반영
  */
 function checkRule1() {
	const trLength = $('tr[id^="dwv_"]').length + 1; 

	let dwDaysSum = 0;
	let workDays = 0;
	//#### 근무제외기간 일수 계산
	for (let i = 1; i < trLength; i++) {
		let sDt = $('#dwvs_'+i).html();
		let eDt = $('#dwve_'+i).html();
		
		sDt = sDt.replace(/\./g, '-');
		eDt = eDt.replace(/\./g, '-');
		
		const dateS = new Date(sDt);
	 	const dateE = new Date(eDt);
	 	
	 	const dateSTime = dateS.getTime();
	 	const dateETime = dateE.getTime();
	 	let dwDays = dateSTime - dateETime;
	 	
	 	dwDays = Math.abs(dwDays / (1000 * 60 * 60 * 24));
	 	dwDaysSum = dwDaysSum + Number(dwDays)+1;
	}
	workDays = Number($('#termDays').val()) - Number(dwDaysSum);	
	$('#termDays').val(workDays) ;

 }