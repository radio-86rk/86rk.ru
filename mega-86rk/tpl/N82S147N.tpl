<h1>N82S147N: прошивка ПЗУ для версии 8085 с ОЗУ (512 - 4) килобайт</h1>

%CFG_MNGR%

<div class=disk><img id=save_N82S147N src=../images/floppy.svgz></div>

<h3>Подключение ПЗУ</h3>
<rom-cfg data-name="conn" data-param="addr,data"
 data-addr="A0,A1,A2,A3,A4,A5,A6,A7,A8:D0,D1,D2,D3,D4,D5,A13,A14,A15"
 data-data="D0,D1,D2,D3,D4,D5,D6,D7:RA13,RA14,RA15,RA16,RA17,RA18"
></rom-cfg>

<br>
<h3>Положение окна в адресном пространстве процессора</h3>
<rom-cfg class=wide data-name="win" data-param="win8,win16"
 data-win8="Окно 8к:0000,2000,4000,6000,8000,A000,C000"
 data-win16="Окно 16к:0000,4000,8000"
></rom-cfg>

<br>
<h3>Конфигурация</h3>
<rom-cfg class=wide data-name=cfg data-count=64 data-param="bank,win8,win16"
 data-bank="Банк:0,1,2,3,4,5,6,7"
 data-win8="Окно 8к:0,1,2,3,4,5,6,7"
 data-win16="Окно 16к:0,1,2,3"
></rom-cfg>

