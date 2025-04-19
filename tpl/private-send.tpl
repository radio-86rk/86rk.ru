<table class=send cellpadding=0 cellspacing=0><tr>
<td class=fs0><img name=mysmiles class=hand src=images/smile-heart.svgz accesskey=s title="любимые смайлики">
<td width=100% class=mess>%input("imess", "", 0, 0, "class=inp autocomplete=off autofocus")%
<td class=fs0 nowrap>
%button("send", "Send", "Send message", "class=btn")%
%?%MOBILE_DEVICE%%:%
%button("xmm", "2RUS", "Преобразовать в русский текст", "class=btn accesskey='r'")%
?%
%?%IS_MODULE("emoji")%
<button type=button name=emoji title="Эмодзи" class=btn>
<svg viewBox="0 0 30 30">
<path d="M15,30C6.7,30,0,23.3,0,15S6.7,0,15,0s15,6.7,15,15S23.3,30,15,30L15,30z M15,2C7.8,2,2,7.8,2,15s5.8,13,13,13s13-5.8,13-13S22.2,2,15,2z M15,22.5c-6,0-7.5-6-7.5-6s4.5,3,7.5,3s7.5-3,7.5-3S21,22.5,15,22.5L15,22.5z M19.5,12c-0.8,0-1.5-0.7-1.5-1.5V9c0-0.8,0.7-1.5,1.5-1.5S21,8.2,21,9v1.5C21,11.3,20.3,12,19.5,12L19.5,12z M10.5,12C9.7,12,9,11.3,9,10.5V9c0-0.8,0.7-1.5,1.5-1.5S12,8.2,12,9v1.5C12,11.3,11.3,12,10.5,12L10.5,12z"/>
</svg>
</button>
?%
%?%PRIV_ATTACHMENTS%
<button type=button name=attach title="Загрузить картинку" class=btn>
<svg viewBox="0 0 300 300">
<path d="M245.9 130.2c25.2-25.1 25.2-65.6 0-90.6s-66.1-25.1-91.3 0L32.9 160.4l-15-15L139.5 24.6c33.7-32.9 87.7-32.8 121.2.4s33.5 86.9.4 120.3L124.3 281.2c-25.2 25.1-66.1 25.1-91.3 0s-25.2-65.6 0-90.6L167.2 58.8c16.5-15.9 42.8-15.7 59.2.4 16.3 16.2 16.4 42.2.4 58.5v.1l-89.5 88.5-14.9-14.8 89.5-88.5c8.2-8.1 8.2-21.3 0-29.5-8.2-8.1-21.6-8.1-29.9 0L47.7 206.2c-16.8 16.7-16.8 43.7 0 60.4s44 16.7 60.8 0l137.4-136.4z"/>
</svg>
</button>
?%
%?%PRIV_DICTAPHONE%
<button type=button name=dictaphone title="Диктофон" class=btn module=1>
<svg viewBox="0 0 300 300">
<path style="fill: var(--btn-mic-path1)" d="M93 85V60c0-33 24-60 57-60s57 27 57 60v25"/>
<path style="fill: var(--btn-mic-path2)" d="M207 103v25c0 33-24 60-57 60s-57-27-57-60v-25"/>
<path style="fill: var(--btn-mic-path3)" d="M225 103v25c0 42-32 78-75 78-42 0-75-36-75-78v-25H39v25c0 30 8 59 29 81 17 17 40 28 64 32v22H96v37h108v-37h-36v-22c23-4 44-15 62-32 22-22 31-51 31-81v-25h-36z"/>
</svg>
</button>
?%
%?%PRIV_WEBCAM%
<button type=button name=video-recorder title=Видеомагнитофон class=btn module=1>
<svg viewBox="0 0 300 300">
<path style="fill: var(--btn-vr-path1)" d="M113.5 113c3 1 6 1 9 1 15 0 27-12 27-27 0-3-1-6-2-9-19 2-33 17-34 35z"/>
<path style="fill: var(--btn-vr-path2)" d="M284 281l-59-59c-21 15-47 24-75 24s-54-9-75-24l-59 59c-3 3-4 8-2 12s6 7 10 7h252c4 0 8-3 10-7s1-9-2-12z"/>
<path style="fill: var(--btn-vr-path3)" d="M264 114c0-46-28-87-67-104-12 13-29 21-47 21s-35-8-47-21C63 28 36 68 36 114c0 63 51 114 114 114s114-50 114-114zm-167 1c0-29 24-53 53-53s53 24 53 53-24 53-53 53-53-24-53-53z"/>
<path style="fill: var(--btn-vr-path4)" d="M150 0c-10 0-19.1 1.2-28 3.4 8 6 18 9.6 28 9.6s20-3.6 28-9.6C169.1 1.2 160 0 150 0z"/>
</svg>
</button>
?%
</tr></table>
