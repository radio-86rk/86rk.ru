%TAB_NAME("СОЗДАТЬ")%
<table class="timer-alarm new alt-inp" cellpadding=3 cellspacing=0>
<tr>
<th colspan=5>ТАЙМЕР/БУДИЛЬНИК</th>
</tr><tr class=cap>
<td width=33%>название / время
<td width=30%>тип
<td width=30%>сигнал
<td>
<td>
</tr><tr>
<td>%NAME("")%
<td>%SELECT_TYPE("таймер", "будильник")%
<td>%SELECT_SOUND({
	alarm1:	"звонок",
	alarm2:	"гудок 1",
	alarm4:	"гудок 2",
	alarm3:	"сирена 1",
	alarm5:	"сирена 2",
	alarm6:	"сирена 3",
	beep1:	"сигнал 1",
	beep2:	"сигнал 2",
	beep3:	"сигнал 3",
	beep4:	"сигнал 4",
	beep5:	"сигнал 5",
	beep6:	"сигнал 6",
	sound1:	"звук 1",
	sound2:	"звук 2",
	sound3:	"звук 3",
	sound4:	"звук 4"
})%
<td width=25>%BUTTON_LISTEN%
<td width=1 height=100% rowspan=4>%BUTTON_OK("&#10004;")%
</tr><tr>
<td><div class=time>%DAY("дд", 3)%%HOUR("чч", 3)%%MIN("мм", 3)%%SEC("сс", 3)%</div>
<td>%SELECT_MODE("однократный", "перезапускаемый", "автоперезапуск")%
<td>%SELECT_LOOP({
	0: "бесконечный цикл",
	1: "1 период",
	2: "2 периода",
	3: "3 периода",
	4: "4 периода",
	5: "5 периодов",
	10: "10 периодов"
})%
<td>
</tr><tr class=cap>
<td>дни
<td>
<td>громкость
<td>
</tr><tr>
<td colspan=2><div class=wdays>%WEEKSDAYS(["пн", "вт", "ср", "чт", "пт", "сб", "вс"])%</div>
<td colspan=2>%RADIO_VOLUME("фиксированная", "нарастающая")%
</tr>
<tr><td colspan=5 class=spacer></tr>
</table>
