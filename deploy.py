from paramiko import SSHClient
ssh = SSHClient()
ssh.load_system_host_keys('id_rsa.txt')
ssh.connect('root@104.193.110.82:2200')
ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command('ls')
print(ssh_stdout) #print the output of ls command
