#bin/bash 

# This script is used to push the code to github. It will ask for the commit message and then push the code to github.
read -p "Enter commit message: " commit_message
git add .
git commit -m "$commit_message"
read -p "Do you want to push the code to github? (y/n) " answer
if [ "$answer" = "y" ]; then
 read -p "Enter branch name: " branch_name
    git push origin $branch_name
else [ "$answer" = "n" ]
    echo "Code not pushed to github."
fi 




