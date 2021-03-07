#prerequisites

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -


sudo apt update
sudo apt -y install nginx git yarn nodejs python3-pip

cd ~/../var/www/
git clone

cp ngwr.online /etc/nginx/sites-available

sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
sudo systemctl restart nginx
sudo systemctl start nginx

generate ssh 
ssh-keygen -t ed25519 -C "ingwarrr.core@yandex.ru"
cat ~/.ssh/id_ed25519.pub

#автозапуск
cp run.sh /etc/init.d/
sudo chmod +x /etc/init.d/run.sh
