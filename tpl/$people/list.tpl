%WINDOW_TITLE("ЛЮДИ ЧАТА – СПИСОК НИКОВ")%
<div class="content people list menu">

<div class=title><div class=index name=index></div>СПИСОК НИКОВ</div>

<table class="list fixed" cellspacing=1 cellpadding=0>
<col width=50%><col width=50%>
<tr><td colspan=2 class=head>
<div class=nav>
<div class=nav1><div>
{{{:LETTER_NAV("АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ")
<a %?%CURRENT%class=cur?% name=page first=%LETTER%>%LETTER%</a>
}}}
</div></div>
А ... Я
</div>
<div class=nav>
<div class=nav1><div>
{{{:LETTER_NAV("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
<a %?%CURRENT%class=cur?% name=page first=%LETTER%>%LETTER%</a>
}}}
</div></div>
A ... Z
</div>
%?
<div class=nav>
<div class=nav1><div>
{{{:PAGE_NAV
<a %?%CURRENT%class=cur?% name=page page=%PAGE%>%PAGE%</a>
}}}
</div></div>
1 ... %PAGES%
</div>
?%
%?:&
<div class=num>%FIRST% &ndash; %LAST%</div>
?%
%?%NICK%
<div><a name=list class=btn>весь список</a></div>
?%
</td></tr>
{{{:LIST:2
%?%CC(1)%<tr class=row>?%
%?
<td><a nickid=%NICKID%%? photo=%PHOTO%?%>%NICK%</a>
%:%
<td colspan=2>
?%
%?%CC(2)%</tr>?%
|||
<tr><td align=center colspan=2><br>Список пуст<br><br></td></tr>
}}}
<tr><th colspan=2 class=line></tr>
</table>

%INCLUDE("menu")%

</div>
