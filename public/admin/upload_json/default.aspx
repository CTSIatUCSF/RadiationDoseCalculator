<%@ Page Language="C#" %>

<script runat="server">
    protected void Button1_Click(object sender, EventArgs e)
    {
        if (FileUpload1.HasFile)
			if (FileUpload1.PostedFile.ContentLength < 1024)
			{
				Label1.Text = "Sorry, the file's too small, or wasn't uploaded correctly";
			}
			else if (!FileUpload1.PostedFile.FileName.EndsWith(".json"))
			{
				Label1.Text = "Sorry, this doesn't seem to be a JSON file";
			}
			else {
				try
				{
					// save in temp location 
					FileUpload1.SaveAs(HttpContext.Current.Server.MapPath("~/") + "js/data/RadiationDataTablesTMP.json");
					// rename old file
					System.IO.File.Move(HttpContext.Current.Server.MapPath("~/") + "js/data/RadiationDataTables.json", 
						HttpContext.Current.Server.MapPath("~/") + "js/data/RadiationDataTables_" + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".json");
					// now rename uploaded file	
					System.IO.File.Move(HttpContext.Current.Server.MapPath("~/") + "js/data/RadiationDataTablesTMP.json", 
						HttpContext.Current.Server.MapPath("~/") + "js/data/RadiationDataTables.json");
					Label1.Text = "Great! JSON file updated<br>You may close this window";
				}
				catch (Exception ex)
				{
					Label1.Text = "ERROR: " + ex.Message.ToString();
				}
			}
        else
        {
            Label1.Text = "You have not specified a file.";
        }
    }
</script>

<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>Upload new JSON file</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:FileUpload ID="FileUpload1" runat="server" /><br />
        <br />
        <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" 
         Text="Upload your updated JSON file" />&nbsp;<br />
        <br />
        <asp:Label ID="Label1" runat="server"></asp:Label></div>
    </form>
</body>
</html>