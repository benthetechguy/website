@echo off
cd %UserProfile%/Documents/GitHub/website
git add *.*
git commit -m "Edit file(s)"
git pull origin master
git push origin master
git pull origin master
pause
exit