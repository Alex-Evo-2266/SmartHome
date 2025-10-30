sudo apt update
sudo apt install -y build-essential libssl-dev zlib1g-dev libbz2-dev \
libreadline-dev libsqlite3-dev libffi-dev liblzma-dev tk-dev git curl

curl https://pyenv.run | bash

pyenv install 3.12.7
