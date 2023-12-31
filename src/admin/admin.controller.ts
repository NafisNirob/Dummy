import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Request, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Session, UseGuards, NotFoundException, HttpStatus } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminDTO, AdminUpdateDTO, LoginDTO, mailDTO } from "./admin.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import session = require("express-session");
import { SessionGuard } from "./session.gaurd";
import { AdminEntity } from "./admin.entity";


@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }
    @Get('/index')
    getIndex(): any {
        return this.adminService.getIndex();
    }

    @Get('/search/:id')
    async getAdminById(@Param('id', ParseIntPipe) id: number): Promise<AdminEntity> {

        const res = await this.adminService.getAdminById(id)
        if (res !== null) {
            console.log(res);
            return res;
        }
        else {
            throw new NotFoundException({
                status: HttpStatus.NOT_FOUND,
                message: "Admin not found"
            });
        }
    }

    @Get('/search')
    getAdminbyIDAndName(@Query() qry: any): object {

        return this.adminService.getAdminbyIDAndName(qry.id, qry.name);
    }

    @Post('/addadmin')
    @UsePipes(new ValidationPipe())
    addAdmin(@Body() data: AdminDTO): object {
        return this.adminService.addAdmin(data);
    }

    @Put('/updateadmin')
    @UseGuards(SessionGuard)
    //@UsePipes(new ValidationPipe())
    updateAdmin(@Body() data: AdminUpdateDTO, @Session() session): object {
        console.log(session.email);
        return this.adminService.updateAdmin(session.email, data);
    }
    @Put('/updateadmin/:id')
    @UsePipes(new ValidationPipe())
    updateAdminbyID(@Param() id: number, @Body() data: AdminDTO): object {
        return this.adminService.updateAdminById(id, data);
    }

    @Post(('/upload'))
    @UseInterceptors(FileInterceptor('myfile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 30000 },
            storage: diskStorage({
                destination: './uploads',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    uploadFile(@UploadedFile() myfileobj: Express.Multer.File): object {
        console.log(myfileobj)
        return ({ message: "file uploaded" });
    }

    @Get('/getimage/:name')
    getImages(@Param('name') name, @Res() res) {
        res.sendFile(name, { root: './uploads' })
    }

    @Post('/addseller')
    addsellers(@Body() seller) {
        console.log(seller);
        return this.adminService.addseller(seller);
    }
    @Get('/getseller/:adminid')
    getManagers(@Param('adminid', ParseIntPipe) adminid: number) {

        return this.adminService.getseller(adminid);
    }

    @Post('/signup')
    @UseInterceptors(FileInterceptor('image',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 30000 },
            storage: diskStorage({
                destination: './uploads',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))
    @UsePipes(new ValidationPipe)
    signup(@Body() mydata: AdminDTO, @UploadedFile() imageobj: Express.Multer.File) {
        console.log(mydata);
        console.log(imageobj.filename);
        mydata.filenames = imageobj.filename;
        return this.adminService.signup(mydata);

    }


    @Get('getimagebyadminid/:adminId')
    async getimagebyid(@Param('adminId', ParseIntPipe) adminId: number, @Res() res) {
        const filename = await this.adminService.getimagebyadminid(adminId);
        res.sendFile(filename, { root: './uploads' })

    }
    @Post('/login')

  @UsePipes(new ValidationPipe())

 async login(@Body() data: LoginDTO, @Session() session) {




      if (await this.adminService.login(data)){

        session.email = data.email;



        return {message: 'success login',email: data.email};

    }

    else

    {

        return {message: 'Invalid login'}

    }

  }
  @Post('/sendmail')
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  sendmail(@Body() data:mailDTO) {
      console.log(data);
      return this.adminService.sendmail(data);
  }



}




