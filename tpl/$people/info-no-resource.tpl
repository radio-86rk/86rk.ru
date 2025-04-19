%?%ERROR%
<span class=error>Ошибка</span>
%:%
<span>
%?%EQ('%RESOURCE%', 'WALL')%
Стена ещё не создана.
%:%%?%EQ('%RESOURCE%', 'BLOG')%
Дневник ещё не создан.
?%?%
%?:&%AUTH%
%?%EQ('%RESOURCE%', 'WALL')%
<br><br><a class=btn name=create_wall>Создать личную стену?</a>
%:%%?%EQ('%RESOURCE%', 'BLOG')%
<br><br><a class=btn name=create_blog>Создать личный дневник?</a>
?%?%
?%
</span>
?%
