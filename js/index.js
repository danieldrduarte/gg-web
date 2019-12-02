var data = {
    orgaos: [],
    bancas: [],
    programas: [],
    formulario: {
        banca : '',
        orgao : '',
        nome : '',
        id: ''
    },
    arvores: '',
    tela: ''
};

new Vue({ 
   el: '#app', 
   data: data,
   mounted () {
        axios.get('http://localhost/api/v1/orgao')
            .then( response => (this.orgaos = response.data.data))
            .catch( error => console.log(error));

        axios.get('http://localhost/api/v1/banca')
            .then( response => (this.bancas = response.data.data))
            .catch( error => console.log(error));

        this.exibeLista();
   },
   methods: {
       exibeFormulario: function (id) {
           let self = this;
           this.limpaCampos();

           if(id){
               axios.get('http://localhost/api/v1/programa/' + id)
                   .then(function (response) {
                       self.formulario.id = response.data.data.id;
                       self.formulario.orgao = response.data.data.orgao_id;
                       self.formulario.banca = response.data.data.banca_id;
                       self.formulario.nome = response.data.data.nome;
                       self.carregaArvores();
                   });
           }

           this.tela = 'cadastro';
       },
       exibeLista: function () {
           this.carregaLista();
           this.tela = 'lista';
       },
       carregaLista: function () {
           axios.get('http://localhost/api/v1/programa')
               .then( response => (this.programas = response.data.data))
               .catch( error => console.log(error));
       },
       carregaArvores: function () {
           var self = this;
           if (this.formulario.orgao && this.formulario.banca) {
               axios.get('http://localhost/api/v1/arvores-assuntos/orgao/' + this.formulario.orgao + '/banca/' + this.formulario.banca)
                   .then(function (response) {
                       var html = '<div class="row" style="margin-top: 10px">';
                           $.each(response.data.data, function(chave,item){
                               html += '<div class="col-md-12" style="margin-top: 10px">';
                               html += '<ul class="list-group">';
                               html += ' <li class="list-group-item active">' + item.nome + '</li>';

                               $.each(item.filhos, function(key,filho){
                                   html += self.montaHtmlFilhos(filho);
                               });

                               html += '</ul>';
                               html += '</div>';
                           });
                       html += '</div>';

                       self.arvores = html;
                   });
           }else{
               this.arvores = '';
           }
       },
       excluir: function(id) {
           var self = this;
           let url = 'http://localhost/api/v1/programa/' + id;
           let msg = "Registro excluído com sucesso!";

           axios.delete(url).then(function (response) {
               alert(msg);
               self.exibeLista();
           });
       },
       salvar: function () {
           var self = this;
           if (self.formulario.orgao && self.formulario.banca) {
               let url = 'http://localhost/api/v1/programa';
               let data = {orgao_id: this.formulario.orgao,banca_id: this.formulario.banca,nome: this.formulario.nome};
               let msg = "Registro salvo com sucesso!";

               if(self.formulario.id != '') {
                    url += '/' + self.formulario.id;
                    msg = "Registro atualizado com sucesso!";

                   axios.put(url, data).then(function (response) {
                       alert(msg);
                       self.limpaCampos();
                       self.exibeLista();
                   });
               }else{
                   axios.post(url, data).then(function (response) {
                       alert(msg);
                       self.limpaCampos();
                       self.exibeLista();
                   });
               }
           }else{
               this.arvores = '';
           }
       },
       montaHtmlFilhos: function (filho){
           let self = this;
           let icone = '';
           for(let i = 2; i < (filho.ordem.length / 3); i++){
               icone += '--------';
           }

           let html = '<li class="list-group-item"><span class="linha">' + icone + ' </span>' + filho.nome + '  <span class="badge badge-success">' + filho.total_questoes + '</span></li>';

           if(filho.filhos){
               $.each(filho.filhos, function(chave, neto){
                   html += self.montaHtmlFilhos(neto);
               });
           }
           return html;
       },
       limpaCampos: function (){
           this.arvores = '';
           this.formulario.id = "";
           this.formulario.banca = "";
           this.formulario.orgao = "";
           this.formulario.nome = "";
       }
   }
 });
