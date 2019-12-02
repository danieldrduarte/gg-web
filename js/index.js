var data = {
    orgaos: [],
    bancas: [],
    arvores: '',
    banca: '',
    orgao: '',
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
   },
   methods: {
       carregaArvores: function () {
           var self = this;
           if (this.orgao && this.banca) {
               axios.get('http://localhost/api/v1/arvores-assuntos/orgao/' + this.orgao + '/banca/' + this.banca)
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
       montaHtmlFilhos: function (filho){
           console.log(filho);
           let self = this;

           let icone = '';
           for(let i = 2; i < (filho.ordem.length / 3); i++){
               icone += '  <i class="fas fa-angle-double-right"></i>';
           }

           let html = '<li class="list-group-item">' + icone + ' ' + filho.nome + ' (' + filho.total_questoes + ')</li>';

           if(filho.filhos){
               $.each(filho.filhos, function(chave, neto){
                   html += self.montaHtmlFilhos(neto);
               });
           }
           return html;
       }
   }
 });
