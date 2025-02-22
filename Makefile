.PHONY: install dev build test coverage test-ui lint preview check-deps check-env

# Verifica se o arquivo .env existe
check-env:
	@test -f .env || cp .env.example .env

# Verifica se o Node.js e Yarn estão instalados
check-deps:
	@command -v node >/dev/null 2>&1 || { echo "Node.js não está instalado. Por favor, instale o Node.js LTS"; exit 1; }
	@command -v yarn >/dev/null 2>&1 || { echo "Yarn não está instalado. Instalando..."; npm install -g yarn; }
	@test -d node_modules/dotenv || { echo "Instalando dependências..."; yarn install; }

# Instala todas as dependências (com verificação)
install: check-deps check-env
	yarn install

# Limpa cache e node_modules e reinstala tudo
clean-install: check-deps
	rm -rf node_modules
	rm -rf yarn.lock
	yarn cache clean
	yarn install

# Inicia o servidor de desenvolvimento
dev: check-deps
	yarn dev

# Executa o build do projeto
build:
	yarn build

# Executa os testes
test:
	yarn test

# Executa os testes com cobertura
coverage:
	yarn test:coverage

# Abre a interface de testes
test-ui:
	yarn test:ui

# Executa o linter
lint:
	yarn lint

# Executa o preview do build
preview:
	yarn preview

# Comando para iniciar tudo que precisa para desenvolvimento
start: check-deps check-env
	make install
	make dev 