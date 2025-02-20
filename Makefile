.PHONY: install dev build test coverage test-ui lint preview

# Instala todas as dependências
install:
	yarn install

# Inicia o servidor de desenvolvimento
dev:
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
start:
	make install
	make dev 