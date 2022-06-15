#!/bin/bash

set -o errexit

is_command_present() {
    type "$1" >/dev/null 2>&1
}

is_mac() {
    [[ $OSTYPE == darwin* ]]
}
# This function checks if the relevant ports required by Appsmith are available or not
# The script should error out in case they aren't available
check_ports_occupied() {
    local port_check_output
    local ports_pattern="80|443"

    if is_mac; then
        port_check_output="$(netstat -anp tcp | awk '$6 == "LISTEN" && $4 ~ /^.*\.('"$ports_pattern"')$/')"
    elif is_command_present ss; then
        # The `ss` command seems to be a better/faster version of `netstat`, but is not available on all Linux
        # distributions by default. Other distributions have `ss` but no `netstat`. So, we try for `ss` first, then
        # fallback to `netstat`.
        port_check_output="$(ss --all --numeric --tcp | awk '$1 == "LISTEN" && $4 ~ /^.*:('"$ports_pattern"')$/')"
    elif is_command_present netstat; then
        port_check_output="$(netstat --all --numeric --tcp | awk '$6 == "LISTEN" && $4 ~ /^.*:('"$ports_pattern"')$/')"
    fi

    if [[ -n $port_check_output ]]; then
        echo "+++++++++++ ERROR ++++++++++++++++++++++"
        echo "Appsmith requires ports 80 & 443 to be open. Please shut down any other service(s) that may be running on these ports."
        echo "You can run appsmith on another port following this guide https://docs.appsmith.com/v/v1.2.1/troubleshooting-guide/deployment-errors"
        echo "++++++++++++++++++++++++++++++++++++++++"
        echo ""
        exit 1
    fi
}

install_docker() {
    echo "++++++++++++++++++++++++"
    echo "Setting up docker repos"

    if [[ $package_manager == apt-get ]]; then
        apt_cmd="sudo apt-get --yes --quiet"
        $apt_cmd update
        $apt_cmd install software-properties-common gnupg-agent
        curl -fsSL "https://download.docker.com/linux/$os/gpg" | sudo apt-key add -
        sudo add-apt-repository \
            "deb [arch=amd64] https://download.docker.com/linux/$os $(lsb_release -cs) stable"
        $apt_cmd update
        echo "Installing docker"
        $apt_cmd install docker-ce docker-ce-cli containerd.io

    elif [[ $package_manager == zypper ]]; then
        zypper_cmd="sudo zypper --quiet --no-gpg-checks --non-interactive"
        echo "Installing docker"
        if [[ $os == sles ]]; then
            os_sp="$(cat /etc/*-release | awk -F= '$1 == "VERSION_ID" { gsub(/"/, ""); print $2; exit }')"
            os_arch="$(uname -i)"
            sudo SUSEConnect -p "sle-module-containers/$os_sp/$os_arch" -r ''
        fi
        $zypper_cmd install docker docker-runc containerd
        sudo systemctl enable docker.service

    else
        yum_cmd="sudo yum --assumeyes --quiet"
        $yum_cmd install yum-utils
        os_in_repo_link="$os"
        if [[ $os == rhel ]]; then
            # For RHEL, there's no separate repo link. We can use the CentOS one though.
            os_in_repo_link=centos
        fi
        sudo yum-config-manager --add-repo "https://download.docker.com/linux/$os_in_repo_link/docker-ce.repo"
        echo "Installing docker"
        $yum_cmd install docker-ce docker-ce-cli containerd.io

    fi

}

install_docker_compose() {
    if [[ $package_manager == "apt-get" || $package_manager == "zypper" || $package_manager == "yum" ]]; then
        if [[ ! -f /usr/bin/docker-compose ]];then
            echo "++++++++++++++++++++++++"
            echo "Installing docker-compose"
            sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
            echo "docker-compose installed!"
            echo ""
        fi
    else
        echo "+++++++++++ IMPORTANT READ ++++++++++++++++++++++"
        echo "docker-compose not found! Please install docker-compose first and then continue with this installation."
        echo "Refer https://docs.docker.com/compose/install/ for installing docker-compose."
        echo "+++++++++++++++++++++++++++++++++++++++++++++++++"
        exit 1
    fi
}

start_docker() {
    if ! sudo systemctl is-active docker.service > /dev/null; then
        echo "Starting docker service"
        sudo systemctl start docker.service
    fi
}

check_os() {
    if is_mac; then
        package_manager="brew"
        desired_os=1
        os="mac"
        return
    fi

    local os_name="$(
        cat /etc/*-release \
            | awk -F= '$1 == "NAME" { gsub(/"/, ""); print $2; exit }' \
            | tr '[:upper:]' '[:lower:]'
    )"

    case "$os_name" in
        ubuntu*)
            desired_os=1
            os="ubuntu"
            package_manager="apt-get"
            ;;
        debian*)
            desired_os=1
            os="debian"
            package_manager="apt-get"
            ;;
        linux\ mint*)
            desired_os=1
            os="linux mint"
            package_manager="apt-get"
            ;;
        red\ hat*)
            desired_os=1
            os="rhel"
            package_manager="yum"
            ;;
        centos*)
            desired_os=1
            os="centos"
            package_manager="yum"
            ;;
        sles*)
            desired_os=1
            os="sles"
            package_manager="zypper"
            ;;
        opensuse*)
            desired_os=1
            os="opensuse"
            package_manager="zypper"
            ;;
        *)
            desired_os=0
            os="Not Found: $os_name"
    esac
}

overwrite_file() {
    local relative_path="$1"
    local template_file="$2"
    local full_path="$install_dir/$relative_path"

    if [[ -f $full_path ]] && ! confirm y "File $relative_path already exists. Would you like to replace it?"; then
        echo "You chose NOT to replace existing file: '$full_path'."
        rm -f "$template_file"
        echo "File $template_file removed from source directory."
        echo ""
    else
        mv -f "$template_file" "$full_path"
    fi
}

# This function prompts the user for an input for a non-empty Mongo root password.
read_mongo_password() {
    read -srp 'Set the mongo password: ' mongo_root_password
    while [[ -z $mongo_root_password ]]; do
        echo ""
        echo ""
        echo "+++++++++++ ERROR ++++++++++++++++++++++"
        echo "The mongo password cannot be empty. Please input a valid password string."
        echo "++++++++++++++++++++++++++++++++++++++++"
        echo ""
        read -srp 'Set the mongo password: ' mongo_root_password
    done
}

# This function prompts the user for an input for a non-empty Mongo username.
read_mongo_username() {
    read -rp 'Set the mongo root user: ' mongo_root_user
    while [[ -z $mongo_root_user ]]; do
        echo ""
        echo "+++++++++++ ERROR ++++++++++++++++++++++"
        echo "The mongo username cannot be empty. Please input a valid username string."
        echo "++++++++++++++++++++++++++++++++++++++++"
        echo ""
        read -rp 'Set the mongo root user: ' mongo_root_user
    done
}

wait_for_containers_start() {
    local timeout=$1

    # The while loop is important because for-loops don't work for dynamic values
    while [[ $timeout -gt 0 ]]; do
        status_code="$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/v1 || true)"
        if [[ status_code -eq 401 ]]; then
            break
        else
            echo -ne "Waiting for all containers to start. This check will timeout in $timeout seconds...\r\c"
        fi
        ((timeout--))
        sleep 1
    done

    echo ""
}

urlencode() {
    # urlencode <string>
    local old_lc_collate="$LC_COLLATE"
    LC_COLLATE=C

    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done

    LC_COLLATE="$old_lc_collate"
}

generate_password() {
    local gen_string="$(/usr/bin/python -c 'import random, string; print("".join(random.choice(string.ascii_letters + string.digits) for _ in range(13)))' 2>/dev/null)"
    if [[ -n $gen_string ]]; then
        echo "$gen_string"
    else
        # Picked up the following method of generation from : https://gist.github.com/earthgecko/3089509
        LC_ALL=C tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 13 | head -n 1
    fi
}

confirm() {
    local default="$1"  # Should be `y` or `n`.
    local prompt="$2"

    local options="y/N"
    if [[ $default == y || $default == Y ]]; then
        options="Y/n"
    fi

    local answer
    read -rp "$prompt [$options] " answer
    if [[ -z $answer ]]; then
        # No answer given, the user just hit the Enter key. Take the default value as the answer.
        answer="$default"
    else
        # An answer was given. This means the user didn't get to hit Enter so the cursor on the same line. Do an empty
        # echo so the cursor moves to a new line.
        echo
    fi

    [[ yY =~ $answer ]]
}

echo_contact_support() {
    echo "Please contact <support@appsmith.com> with your OS details and version${1:-.}"
}

bye() {  # Prints a friendly good bye message and exits the script.
    if [ "$?" -ne 0 ]; then
        set +o errexit
        echo ""
        echo -e "\n安装失败！如果需要帮助，可以直接在微信群或者Github上联系我们，再会👋 \n"
        exit 0
    fi
}

ask_telemetry() {
    echo ""
    echo "+++++++++++ IMPORTANT ++++++++++++++++++++++"
    echo -e "Thank you for installing appsmith! We want to be transparent and request that you share anonymous usage data with us."
    echo -e "This data is purely statistical in nature and helps us understand your needs & provide better support to your self-hosted instance."
    echo -e "You can read more about what information is collected in our documentation https://docs.appsmith.com/v/v1.2.1/setup/telemetry"
    echo -e ""
    if confirm y 'Would you like to share anonymous usage data and receive better support?'; then
        disable_telemetry="false"
    else
        disable_telemetry="true"
        echo "Please note that even though telemetry is disabled, your Appsmith server will connect to cloud to fetch release notes and to check for updates."
    fi
    echo "++++++++++++++++++++++++++++++++++++++++++++"
}

echo -e "👋 Thank you for trying out Appsmith! "
echo ""


# Checking OS and assigning package manager
desired_os=0
os=""
echo -e "🕵️  Detecting your OS"
check_os

APPSMITH_INSTALLATION_ID=$(curl -s 'https://api64.ipify.org')

# Run bye if failure happens
trap bye EXIT

if [[ $desired_os -eq 0 ]];then
    echo ""
    echo "This script is currently meant to install Appsmith on Mac OS X, Ubuntu, Debian, Linux Mint, Red Hat, CentOS, SLES or openSUSE machines."
    echo_contact_support " if you wish to extend this support."
    exit 1
else
    echo "🙌 You're on an OS that is supported by this installation script."
    echo ""
fi

check_ports_occupied

read -rp 'Create an Installation Directory: [appsmith]' install_dir
install_dir="${install_dir:-appsmith}"
if [[ $install_dir != /* ]]; then
    # If it's not an absolute path, prepend current working directory to it, to make it an absolute path.
    install_dir="$PWD/$install_dir"
fi

if [[ -e "$install_dir" && -n "$(ls -A "$install_dir")" ]]; then
    echo "The path '$install_dir' is already present and is non-empty. Please run the script again with a different path to install new."
    echo "If you're trying to update your existing installation, that happens automatically through WatchTower."
    echo_contact_support " if you're facing problems with the auto-updates."
    exit 1
fi

# Check is Docker daemon is installed and available. If not, the install & start Docker for Linux machines. We cannot automatically install Docker Desktop on Mac OS
if ! is_command_present docker; then
    if [[ $package_manager == "apt-get" || $package_manager == "zypper" || $package_manager == "yum" ]]; then
        install_docker
    else
        echo ""
        echo "+++++++++++ IMPORTANT READ ++++++++++++++++++++++"
        echo "Docker Desktop must be installed manually on Mac OS to proceed. Docker can only be installed automatically on Ubuntu / openSUSE / SLES / Redhat / Cent OS"
        echo "https://docs.docker.com/docker-for-mac/install/"
        echo "++++++++++++++++++++++++++++++++++++++++++++++++"
        exit 1
    fi
fi

# Install docker-compose
if ! is_command_present docker-compose; then
    install_docker_compose
fi

# Starting docker service
if [[ $package_manager == "yum" || $package_manager == "zypper" || $package_manager == "apt-get" ]]; then
    start_docker
fi

echo "Installing Appsmith to '$install_dir'."
mkdir -p "$install_dir"
echo ""

if confirm y "Is this a fresh installation?"; then
    mongo_host="mongo"
    mongo_database="appsmith"

    # We invoke functions to read the mongo credentials from the user because they MUST be non-empty
    read_mongo_username
    read_mongo_password

    # Since the mongo was automatically setup, this must be the first time installation. Generate encryption credentials for this scenario
    auto_generate_encryption="true"
else
    echo 'You are trying to connect to an existing appsmith database. Abort if you want to install appsmith using the default database'
    read -rp 'Enter your existing appsmith mongo db host: ' mongo_host
    read -rp 'Enter your existing appsmith mongo root user: ' mongo_root_user
    read -srp 'Enter your existing appsmith mongo password: ' mongo_root_password
    echo ""
    read -rp 'Enter your existing appsmith mongo database name: ' mongo_database
    # It is possible that this isn't the first installation.
    echo ""
    # In this case be more cautious of auto generating the encryption keys. Err on the side of not generating the encryption keys
    if confirm y "Do you have any existing data in the database?"; then
        auto_generate_encryption="false"
    else
        auto_generate_encryption="true"
    fi
fi
echo ""

# urlencoding the Mongo username and password
encoded_mongo_root_user=$(urlencode "$mongo_root_user")
encoded_mongo_root_password=$(urlencode "$mongo_root_password")

encryptionEnv=./template/encryption.env
if test -f "$encryptionEnv"; then
    echo "CAUTION : This isn't your first time installing appsmith. Encryption password and salt already exist. Do you want to override this? NOTE: Overwriting the existing salt and password would lead to you losing access to sensitive information encrypted using the same"
    echo "1) No. Conserve the older encryption password and salt and continue"
    echo "2) Yes. Overwrite the existing encryption (NOT SUGGESTED) with autogenerated encryption password and salt"
    echo "3) Yes. Overwrite the existing encryption (NOT SUGGESTED) with manually entering the encryption password and salt"
    read -rp 'Enter option number [1]: ' overwrite_encryption
    overwrite_encryption=${overwrite_encryption:-1}
    auto_generate_encryption="false"
    if [[ $overwrite_encryption -eq 1 ]];then
        setup_encryption="false"
    elif [[ $overwrite_encryption -eq 2 ]];then
        setup_encryption="true"
        auto_generate_encryption="true"
    elif [[ $overwrite_encryption -eq 3 ]];then
        setup_encryption="true"
        auto_generate_encryption="false"
    fi
else
    setup_encryption="true"
fi

if [[ "$setup_encryption" = "true" ]];then
    if [[ "$auto_generate_encryption" = "false" ]];then
        echo "Please enter the salt and password found in the encyption.env file of your previous appsmith installation "
        read -rp 'Enter your encryption password: ' user_encryption_password
        read -rp 'Enter your encryption salt: ' user_encryption_salt
    elif [[ "$auto_generate_encryption" = "true" ]]; then
        user_encryption_password=$(generate_password)
        user_encryption_salt=$(generate_password)
    fi
fi

echo ""

NGINX_SSL_CMNT="#"

ask_telemetry
echo ""
echo "Downloading the configuration templates..."
templates_dir="$install_dir/tmp"
mkdir -p "$templates_dir"

(
    cd "$templates_dir"
    wget \
        https://raw.githubusercontent.com/lifeneedspassion/ppDeploy/master/template/docker-compose.yml.sh \
        https://raw.githubusercontent.com/lifeneedspassion/ppDeploy/master/template/mongo-init.js.sh \
        https://raw.githubusercontent.com/lifeneedspassion/ppDeploy/master/template/docker.env.sh \
        https://raw.githubusercontent.com/lifeneedspassion/ppDeploy/master/template/nginx_app.conf.sh \
        https://raw.githubusercontent.com/lifeneedspassion/ppDeploy/master/template/encryption.env.sh
    sed -i 's/index\.docker\.io\/appsmith\/appsmith-editor/index\.docker\.io\/cloudtogouser\/pageplug-client:v1\.5\.15/g' docker-compose.yml.sh
    sed -i 's/index\.docker\.io\/appsmith\/appsmith-server/index\.docker\.io\/cloudtogouser\/pageplug-server:v1\.5\.15/g' docker-compose.yml.sh
)

# Create needed folder structure.
mkdir -p "$install_dir/data/"{nginx,mongo/db}

echo ""
echo "Generating the configuration files from the templates"
bash "$templates_dir/nginx_app.conf.sh" "$NGINX_SSL_CMNT" "$custom_domain" > "$templates_dir/nginx_app.conf"
bash "$templates_dir/docker-compose.yml.sh" "$mongo_root_user" "$mongo_root_password" "$mongo_database" > "$templates_dir/docker-compose.yml"
bash "$templates_dir/mongo-init.js.sh" "$mongo_root_user" "$mongo_root_password" > "$templates_dir/mongo-init.js"
bash "$templates_dir/docker.env.sh" "$mongo_database" "$encoded_mongo_root_user" "$encoded_mongo_root_password" "$mongo_host" "$disable_telemetry" > "$templates_dir/docker.env"
if [[ "$setup_encryption" = "true" ]]; then
    bash "$templates_dir/encryption.env.sh" "$user_encryption_password" "$user_encryption_salt" > "$templates_dir/encryption.env"
fi

overwrite_file "data/nginx/app.conf.template" "$templates_dir/nginx_app.conf"
overwrite_file "docker-compose.yml"           "$templates_dir/docker-compose.yml"
overwrite_file "data/mongo/init.js"           "$templates_dir/mongo-init.js"
overwrite_file "docker.env"                   "$templates_dir/docker.env"
overwrite_file "encryption.env"               "$templates_dir/encryption.env"

echo ""

cd "$install_dir"

rm -rf "$templates_dir"

echo ""
echo "Pulling the latest container images"
sudo docker-compose pull
echo ""
echo "Starting the Appsmith containers"
# The docker-compose command does some nasty stuff for the `--detach` functionality. So we add a `|| true` so that the
# script doesn't exit because this command looks like it failed to do it's thing.
sudo docker-compose up --detach --remove-orphans || true

wait_for_containers_start 60
echo ""

if [[ $status_code -ne 401 ]]; then
    echo "+++++++++++ ERROR ++++++++++++++++++++++"
    echo "The containers didn't seem to start correctly. Please run the following command to check containers that may have errored out:"
    echo ""
    echo -e "cd \"$install_dir\" && sudo docker-compose ps -a"
    echo "Please read our troubleshooting guide https://docs.appsmith.com/v/v1.2.1/troubleshooting-guide/deployment-errors"
    echo "or reach us on Discord for support https://discord.com/invite/rBTTVJp"
    echo "++++++++++++++++++++++++++++++++++++++++"
    exit 1
else

    echo "++++++++++++++++++ SUCCESS ++++++++++++++++++++++"
    echo "Your installation is complete!"
    echo ""
    echo "Your application is running on 'http://localhost'."
    echo ""
    echo "+++++++++++++++++++++++++++++++++++++++++++++++++"
    echo ""
fi
echo -e "\Thank you!\n"
