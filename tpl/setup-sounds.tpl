<table cellspacing=0 cellpadding=0>
<tr><th>Звуки</th></tr><tr>
<td>
<div align=center>Громкость: <span id=volume></span>%</div>
<div class=slider><div id=slider></div></div>
</td></tr>
<tr><td nowrap class=sounds>

%checkbox("use_my_sound", 0, 1, "сообщение для меня")%
<div>
<select name=my_sound class=inp></select>
%button("play_my", "", "прослушать", "class=speaker")%
</div>
%checkbox("use_nb_sound", 0, 1, "мне пришла записка")%
<div>
<select name=nb_sound class=inp></select>
%button("play_nb", "", "прослушать", "class=speaker")%
</div>
%checkbox("use_pr_sound", 0, 1, "приглашение в приват")%
<div>
<select name=pr_sound class=inp></select>
%button("play_pr", "", "прослушать", "class=speaker")%
</div>
%?%PRIV_WEBCAM%
%checkbox("use_wc_sound", 0, 1, "подключение к веб-камере")%
<div>
<select name=wc_sound class=inp></select>
%button("play_wc", "", "прослушать", "class=speaker")%
</div>
?%
%checkbox("use_vote_sound", 0, 1, "начало голосования")%
<div>
<select name=vote_sound class=inp></select>
%button("play_vote", "", "прослушать", "class=speaker")%
</div>
%checkbox("use_nick_sound", 0 , 1, "пришел/ушел друг")%
<div>
<select name=nick_sound class=inp></select>
%button("play_nick", "", "прослушать", "class=speaker")%
</div>
<hr>
<div>
%input("add_nick", "", 0, 0, "placeholder='введите ник, кого ждем' class=inp")%
%button("add", "+", "добавить ник", "class='btn add-friend'")%
</div>
<select name=nick_list size=3 class=inp></select>

</td></tr>
</table>
