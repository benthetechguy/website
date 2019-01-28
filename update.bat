@echo off
cd %UserProfile%/Documents/GitHub/website
git add *.*
git commit -m "Edit file(s)"
git push origin master
git pull origin master
pause
exit