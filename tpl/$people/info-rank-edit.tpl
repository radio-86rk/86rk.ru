<h3>Звание</h3>
<hr>
<div>
%radio("rank", 0, "* без спец. звания *")%
{{{
%radio("rank", %RANK_ID%, "%RANK_TITLE%")%
}}}
</div>
<hr>
%button("rank_save", "OK", "", "class=w100")%
