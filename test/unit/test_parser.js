var expect = chai.expect;

describe('Parser', function(){
  describe('codegen', function(){
    it('build query url without explict orderby', function(){
      url="http://moztrap.com/api/v1/caseversion/";
      //var qss = ['order_by=modified_on', 'product="Firefox OS"'];
      var qss = 'product:"Firefox OS"';
      var url = buildQueryUrl(url, qss, caseversionCodegen);
      expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?&productversion__product__name__icontains=Firefox%20OS&order_by=-modified_on");
      //expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?order_by=modified_on&product=\"Firefox OS\"");
    }); 
    it('build query url with explict orderby', function(){
      url="http://moztrap.com/api/v1/caseversion/";
      //var qss = ['order_by=modified_on', 'product="Firefox OS"'];
      var qss = 'product:"Firefox OS" orderby:name';
      var url = buildQueryUrl(url, qss, caseversionCodegen);
      expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?&productversion__product__name__icontains=Firefox%20OS&order_by=name");
      //expect(url).to.be.equal("http://moztrap.com/api/v1/caseversion/?order_by=modified_on&product=\"Firefox OS\"");
    }); 
    it('parse basic query into tokens', function(){
      var query = "product:\"Firefox OS\" suite:Test hello";
      var result = tokenize(String(query));
      var expected = [{key:"product", value:"\"Firefox OS\""}, {key:"suite", value:"Test"}, {key:"", value:"hello"}];
      //expect(result.length).to.be.equal(expected.length);

      expect(result).to.be.eql(expected);
    });

    it('Turn caseversion tokens into TastyPie search queries', function(){
      var testDatum = [
        {input: [{key:"name", value:"foobar"}], expected: ["name__icontains=foobar"]},
        //{input: [{key:"foo", value:"foofoo"}], expected: ["name__icontains=foofoo"]},
        {input: [{key:"foo", value:"foofoo"}], expected: [""]},
        {input: [{key:"tag", value:"foofoo"}], expected: ["tags__name__icontains=foofoo"]},
        {input: [{key:"suite", value:"foofoo"}], expected: ["case__suites__name__icontains=foofoo"]},
        {input: [{key:"product", value:"foofoo"}], expected: ["productversion__product__name__icontains=foofoo"]},
        {input: [{key:"ver", value:"2.4"}], expected: ["productversion__version__icontains=2.4"]},
        {input: [{key:"status", value:"active"}], expected: ["status=active"]},
        {input: [{key:"name", value:"\"foo bar\""}], expected: ["name__icontains=foo%20bar"]},
      ];
      for (var testData of testDatum) {
        var result = caseversionCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
    });

    it('Turn suite tokens into TastyPie search queries', function(){
      var testDatum = [
        {input: [{key:"name", value:"foobar"}], expected: ["name__icontains=foobar"]},
        {input: [{key:"", value:"foobar"}], expected: ["name__icontains=foobar"]},
        //{input: [{key:"foo", value:"foofoo"}], expected: ["name__icontains=foofoo"]},
        {input: [{key:"foo", value:"foofoo"}], expected: [""]},
        {input: [{key:"product", value:"foofoo"}], expected: ["product__name__icontains=foofoo"]},
        {input: [{key:"status", value:"active"}], expected: ["status=active"]},
      ];
      for (var testData of testDatum) {
        var result = suiteCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
    });

    it('Turn order by tokens into TastyPie search queries', function(){
      var testDatum = [
        {input: [{key:"orderby", value:"name"}], expected: ["order_by=name"]},
        {input: [{key:"orderby", value:"-name"}], expected: ["order_by=-name"]},
        {input: [{key:"orderby", value:"+name"}], expected: ["order_by=+name"]},
      ];
      for (var testData of testDatum) {
        var result = suiteCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
      for (var testData of testDatum) {
        var result = caseselectionCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
      for (var testData of testDatum) {
        var result = caseversionCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
    });

    it('Tokens to URI querystring', function(){
      var testDatum = [
        {input: [{key:"orderby", value:"name"}], expected: ["orderby=name"]},
        {input: [{key:"name", value:"MozTrap"}], expected: ["name=MozTrap"]},
      ];
      for (var testData of testDatum) {
        var result = urlCodegen(testData.input);
        expect(result).to.be.eql(testData.expected);
      }
    });
  });
});

