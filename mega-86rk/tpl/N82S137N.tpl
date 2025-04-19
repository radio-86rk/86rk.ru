<h1>N82S137N: прошивка ПЗУ для универсального модуля "Радио-86РК"</h1>

%CFG_MNGR%

<div class=disk><img id=save_N82S137N src=../images/floppy.svgz></div>

<h3>Дешифратор</h3>
<rom-cfg class=wide2 data-name="dc" data-param="code"
 data-code="0,1,2,3,4,5,6,7:RAM0,RAM1,ROM,KBD,PORT,CRT,TIMER,RTC,MCU,CS0,CS1,FONT,EXT,DMA,DMA+EXT,DMA+ROM,FONT+EXT,FONT+ROM"
></rom-cfg>
<rom-cfg class=wide2 data-name="dc" data-param="code"
 data-code="8,9,10,11,12,13,14,15:RAM0,RAM1,ROM,KBD,PORT,CRT,TIMER,RTC,MCU,CS0,CS1,FONT,EXT,DMA,DMA+EXT,DMA+ROM,FONT+EXT,FONT+ROM"
></rom-cfg>

<br>
<h3>Конфигурация</h3>
<rom-cfg id=cfg class=wide data-name=cfg data-count=16 data-param="device,addr,size"
 data-device="Устройство:RAM0,RAM1,ROM,KBD,PORT,CRT,TIMER,RTC,MCU,CS0,CS1,FONT,EXT,DMA,DMA+EXT,DMA+ROM,FONT+EXT,FONT+ROM"
 data-addr="Начальный адрес:"
 data-size="Размер"
></rom-cfg>

