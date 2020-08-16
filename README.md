# nimpi-api

Utilize o comando "npm i" para instalar os módulos.

# Banco de dados #
Por padrão, a aplicação está usando o Mongo Cloud, portanto, para ter acesso ao banco, é necessário adicionar o endereço IP atual na "IP Whitelist" no projeto que está no site: https://cloud.mongodb.com.
Caso queira utilizar o mongodb, basta alterar as variáveis de ambiente DB_CONNECT em .env direcionando para o banco local.

# Local de armazenamento #
Os arquivos podem ser armazenados em local storage ou AWS.
LOCAL STORAGE: define a variável de ambiente STORAGE_TYPE=local;
AWS: define a variável de ambiente STORAGE_TYPE=s3.

# Configuração adicional do AWS #
No modo AWS, caso ocorra erro 500 instale (global) as dependências da Interface da Linha de Comando da AWS com o comando: sudo apt install awscli. Em seguida define as credenciais com o comando "aws credentials" e insira os dados conforme consta no .env:
AWS_ACESS_KEY_ID=AKIAV3RZBGVOD34U3ZFI
AWS_SECRET_ACESS_KEY=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
AWS_DEFAULT_REGION=sa-east-1
O tipo de documento é json.
